import React, { createContext } from "react";

import { arraymove } from "../utils/const";
const KanbanContext = createContext();

const API_URL = "api/";
const JWT = "jwt";
const CARDS = "cards";
const PROJECTS = "projects";

// This will correspond with the ones stored in the database
class Card {
    constructor(
        id, // unique key
        description, // text content
        index, // used to save the order of the cards to DB
        column, // possible values eg. backlog, todo, doing...
        priority // integer between like 1 - 3
    ) {
        this.id = id;
        this.description = description;
        this.index = index;
        this.column = column;
        this.priority = priority;
    }
}

class KanbanContextProvider extends React.Component {
    constructor(props) {
        super();
        this.state = {
            columns: {},
            project_id: 1,
        };
        this.changeCardPosition = this.changeCardPosition.bind(this);
        this.getCards = this.getCards.bind(this);
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

    async addCard(description, column) {
        const requestConf = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                description: description,
                column: column,
                project_id: this.state.project_id,
            }),
        };

        fetch(API_URL + CARDS, requestConf)
            .then((res) => res.json())
            .then((resJson) => console.log(resJson));
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

    async updateCard(id, description) {
        const requestConf = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description: description }),
        };

        fetch(`${API_URL + CARDS}/${id}`, requestConf)
            .then((res) => res.json())
            .then((resJson) => console.log(resJson))
            .catch((err) => err);
    }

    render() {
        const { columns, cards } = this.state;
        const { changeCardPosition, getCards } = this;

        return (
            <KanbanContext.Provider
                value={{
                    columns,
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
