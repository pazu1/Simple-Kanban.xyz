import React, { createContext } from "react";

import { arraymove } from "../utils/const";
const KanbanContext = createContext();

const API_URL = "api/";
const JWT = "jwt";
const CARDS = "cards";
const PROJECTS = "projects";

// TODO: error handling

// This will correspond with the ones stored in the database
class Card {
    constructor(
        id, // unique key, -1 if has not been fetched from the API
        description, // text content
        index, // used to save the order of the cards to DB
        column, // possible values eg. backlog, todo, doing...
        priority, // integer between like 1 - 3
        finished = true // false if card is still being created or edited
    ) {
        this.id = id;
        this.description = description;
        this.index = index;
        this.column = column;
        this.priority = priority;
        this.finished = finished;
    }
}

class KanbanContextProvider extends React.Component {
    constructor(props) {
        super();
        this.state = {
            columns: {},
            project_id: null,
            unfinishedCard: null, // A card that is being edited is stored here
        };
        this.changeCardPosition = this.changeCardPosition.bind(this);
        this.addCard = this.addCard.bind(this);
        this.removeCard = this.removeCard.bind(this);
        this.finishCardEdit = this.finishCardEdit.bind(this);
        this.cancelCardEdit = this.cancelCardEdit.bind(this);
        this.updateCardPriority = this.updateCardPriority.bind(this);
    }

    async componentDidMount() {
        await this.getJwt();
        let projects = await this.getProjects();
        if (!projects) return;
        console.log(projects);
        let project = projects[0]; // TODO: this should probably be the project that the user last accessed, now it's just the first one in the list
        let resCards = await this.getCards(project.project_id);
        let cards = resCards
            .map((c) => {
                return new Card(
                    c.card_id,
                    c.description,
                    c.k_index,
                    c.k_column,
                    c.k_priority
                );
            })
            .sort((ca, cb) => {
                let a = ca.index;
                let b = cb.index;
                return a < b ? -1 : a > b ? 1 : 0;
            });

        let columns = project.k_columns;
        let newColumns = {};
        columns.forEach((col) => {
            newColumns[col] = [];
            cards.forEach((c) => {
                if (c.column === col) {
                    newColumns[col].push(c);
                }
            });
        });

        if (!resCards) return;

        this.setState({
            project_id: projects[0].project_id,
            columns: newColumns,
        });
    }

    // Add a rendered card (to the current project)
    addCard(column, index) {
        this.setState((prevState) => {
            let copyColumns = prevState.columns;
            let copyColumn = copyColumns[column];
            const card = new Card(-1, "", index, column, 1, false);
            copyColumns[column].push(card);
            return { columns: copyColumns, unfinishedCard: card };
        });
    }

    async removeCard(card) {
        await this.deleteCard(card.id);
        let copyColumns = this.state.columns;
        let cardColumn = copyColumns[card.column];
        cardColumn.splice(cardColumn.indexOf(card), 1);
        cardColumn.forEach((c, i) => {
            c.index = i;
        });
        await this.updateColumns(cardColumn, []); // Update the indices
        this.setState({ columns: copyColumns });
    }

    // Clear state.unfinishedCard and call API to add it to the database.
    // Called after a new card is created or an existing card was edited.
    async finishCardEdit(description) {
        let editedCard = this.state.unfinishedCard;
        let copyColumns = this.state.columns;
        editedCard.description = description;
        editedCard.finished = true;
        if (editedCard.id !== -1) {
            // TODO: call API card update instead of post
            return;
        }

        // API call to add card and get id
        let response = await this.postCard(editedCard);
        console.log(response);
        if (!response) {
            console.log("Error posting card");
            this.cancelCardEdit();
            return;
        }
        editedCard.id = response.card_id;
        this.setState({
            unfinishedCard: null,
            columns: copyColumns,
        });
    }

    // Remove card from column if it was a blank one not in the DB (id=-1).
    // Otherwise set it to finished and leave unchanged.
    cancelCardEdit() {
        if (!this.state.unfinishedCard) return;
        let cancelledCard = this.state.unfinishedCard;
        let copyColumns = this.state.columns;
        if (cancelledCard.id !== -1) {
            cancelledCard.finished = true;
            this.setState({
                unfinishedCard: null,
                columns: copyColumns,
            });
            return;
        }
        copyColumns[cancelledCard.column].pop();
        this.setState({
            unfinishedCard: null,
            columns: copyColumns,
        });
    }

    // Change card index and/or column
    changeCardPosition(card, toColumn, toIndex = 0) {
        const ca = toColumn;
        const cb = card.column;
        const callAPI = () => {
            this.updateColumns(this.state.columns[ca], this.state.columns[cb]);
        };
        if (card.column === toColumn) {
            this.setState(
                (prevState) => {
                    let copyColumns = prevState.columns;
                    let array = copyColumns[toColumn];
                    let fromIndex = array.findIndex((c) => c === card);
                    arraymove(array, fromIndex, toIndex);

                    array.forEach((c, i) => {
                        c.index = i;
                    });

                    return { columns: copyColumns };
                },
                () => callAPI()
            );
            return;
        }
        this.setState(
            (prevState) => {
                let oldColumn = card.column;
                let copyColumns = prevState.columns;
                copyColumns[toColumn].splice(toIndex, 0, card);
                card.column = toColumn;

                var i = copyColumns[oldColumn].indexOf(card);
                copyColumns[oldColumn].splice(i, 1);

                copyColumns[oldColumn].forEach((c, i) => {
                    c.index = i;
                });
                copyColumns[toColumn].forEach((c, i) => {
                    c.index = i;
                });

                return { columns: copyColumns };
            },
            () => callAPI()
        );
    }

    updateCardPriority(priority, card) {
        if (card.priority === priority) return;
        let copyColumns = this.state.columns;
        card.priority = priority;
        this.updateCard(card.id, card.description, priority);
        this.setState({
            columns: copyColumns,
        });
    }

    //
    // API calls
    //
    async getJwt() {
        const res = await fetch(API_URL + JWT);
        try {
            const jwt = await res.clone().json();
        } catch (err) {
            const message = await res.text();
            console.log(message);
        }
    }

    async getProjects() {
        try {
            let res = await fetch(API_URL + PROJECTS);
            return res.json();
        } catch (err) {
            return false;
        }
    }

    async getCards(project_id) {
        try {
            let current_pr_id = `/?project_id=${project_id}`;
            let res = await fetch(API_URL + CARDS + current_pr_id);
            return res.json();
        } catch (err) {
            return false;
        }
    }

    async postCard(card) {
        let { description, column, index, priority } = card;
        const requestConf = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                description: description,
                index: index,
                column: column,
                priority: priority,
                project_id: this.state.project_id,
            }),
        };

        try {
            let res = await fetch(API_URL + CARDS, requestConf);
            let resJson = res.json();
            return resJson;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async deleteCard(id) {
        const requestConf = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        };

        fetch(`${API_URL + CARDS}/${id}`, requestConf)
            .then((res) => res.json())
            .then((resJson) => console.log(resJson))
            .catch((err) => err);
    }

    async updateColumns(columnA, columnB) {
        const requestConf = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ columnA: columnA, columnB: columnB }),
        };

        fetch(`${API_URL + CARDS}`, requestConf)
            .then((res) => res.json())
            .then((resJson) => console.log(resJson))
            .catch((err) => err);
    }

    async updateCard(id, description = null, priority = null) {
        const requestConf = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                description: description,
                priority: priority,
            }),
        };
        console.log(id);

        fetch(`${API_URL + CARDS}/${id}`, requestConf)
            .then((res) => res.json())
            .then((resJson) => console.log(resJson))
            .catch((err) => err);
    }

    render() {
        const { columns, unfinishedCard } = this.state;
        const {
            addCard,
            removeCard,
            updateCardPriority,
            finishCardEdit,
            cancelCardEdit,
            changeCardPosition,
            getCards,
        } = this;

        return (
            <KanbanContext.Provider
                value={{
                    columns,
                    unfinishedCard,
                    addCard,
                    removeCard,
                    updateCardPriority,
                    finishCardEdit,
                    cancelCardEdit,
                    changeCardPosition,
                    getCards,
                }}
            >
                {this.props.children}
            </KanbanContext.Provider>
        );
    }
}

export default KanbanContext;

export { KanbanContextProvider };
