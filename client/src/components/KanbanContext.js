import React, { createContext } from "react";

import { arraymove } from "../utils/const";
import APIConnection from "../APIConnection";
const KanbanContext = createContext();

// This class works as middleware between the UI and API calls

// TODO: reporting errors to user and UI feedback
// refactor setStates to be more robust, wrap more of the function into setState

class Column {
    constructor(
        id,
        title,
        cards,
        finished = true // false if column is still being created or edited
    ) {
        this.id = id;
        this.title = title;
        this.cards = cards;
        this.finished = finished;
    }
}
// This will correspond with the ones stored in the database
class Card {
    constructor(
        id, // unique key, -1 if has not been fetched from the API
        description, // text content
        index, // used to save the order of the cards to DB
        columnId, // id of the column where the card belongs to
        columnTitle, // name of the column where the card belongs to
        priority, // integer between like 1 - 3
        finished = true // false if card is still being created or edited
    ) {
        this.id = id;
        this.description = description;
        this.index = index;
        this.columnId = columnId;
        this.priority = priority;
        this.finished = finished;
    }
}

class KanbanContextProvider extends React.Component {
    constructor() {
        super();
        this.state = {
            columns: [],
            currentProject: null,
            unfinishedColumns: [], // Columns that are being edited, must be empty when editing is done
            deletedColumns: [],
            unfinishedCTitle: null, // A column title being edited
            unfinishedCard: null, // A card that is being edited
            synchronizing: true,
        };
        this.changeCardPosition = this.changeCardPosition.bind(this);
        this.addCard = this.addCard.bind(this);
        this.removeCard = this.removeCard.bind(this);
        this.makeCardEditable = this.makeCardEditable.bind(this);
        this.finishCardEdit = this.finishCardEdit.bind(this);
        this.cancelCardEdit = this.cancelCardEdit.bind(this);
        this.updateCardPriority = this.updateCardPriority.bind(this);
        this.moveColumn = this.moveColumn.bind(this);
        this.cancelColumnEdit = this.cancelColumnEdit.bind(this);
        this.finishColumnEdit = this.finishColumnEdit.bind(this);
        this.removeColumn = this.removeColumn.bind(this);
        this.addColumn = this.addColumn.bind(this);
    }

    async componentDidMount() {
        this.API = new APIConnection();
        await this.API.getToken();

        // Get project
        let resProjects = await this.API.getProjects();
        let projects = resProjects.content;
        if (!projects) return;
        let project = {
            projectId: null,
            columns: [],
            projectName: "",
        };
        project.projectId = projects[0].project_id;
        project.projectName = projects[0].project_name;
        project.columns = projects
            .filter((pr) => pr.project_id === project.projectId)
            .map((pr) => {
                return new Column(pr.k_column_id, pr.title, [], true);
            });
        let resCards = await this.API.getCards(project.projectId);
        let fetchedCards = resCards.content;
        let cards = fetchedCards
            .map((c) => {
                return new Card(
                    c.card_id,
                    c.description,
                    c.k_index,
                    c.k_column_id,
                    "",
                    c.k_priority
                );
            })
            .sort((ca, cb) => {
                let a = ca.index;
                let b = cb.index;
                return a < b ? -1 : a > b ? 1 : 0;
            });
        project.columns.forEach((col, i) => {
            cards.forEach((c) => {
                if (c.columnId === col.id) {
                    c.columnTitle = col.title;
                    project.columns[i].cards.push(c);
                }
            });
        });

        if (!resCards) return;

        console.log(project.columns);

        this.setState({
            currentProject: project,
            columns: project.columns,
            synchronizing: false,
        });
    }

    // Add a rendered card (to the current project)
    addCard(columnTitle, index) {
        this.setState((prevState) => {
            let copyColumns = prevState.columns;
            let copyColumn = copyColumns.find(
                (col) => col.title === columnTitle
            );
            const card = new Card(-1, "", index, columnTitle, 1, false);
            copyColumn.cards.push(card);
            return { columns: copyColumns, unfinishedCard: card };
        });
    }

    async removeCard(card) {
        // TODO: wrap in setState
        let res = await this.API.deleteCard(card.id);
        let copyColumns = this.state.columns;
        let cardColumn = copyColumns.find((col) => col.title === card.column)
            .cards;
        cardColumn.splice(cardColumn.indexOf(card), 1);
        if (cardColumn.length) {
            cardColumn.forEach((c, i) => {
                c.index = i;
            });
            let res = await this.API.updateColumns(cardColumn, []); // Update the indices
        }
        this.setState({ columns: copyColumns }); // TODO: return
    }

    makeCardEditable(card) {
        card.finished = false;
        this.setState({ unfinishedCard: card }); // TODO: return
    }

    // Clear state.unfinishedCard and call API to add it to the database.
    // Called after a new card is created or an existing card was edited.
    async finishCardEdit(description) {
        let editedCard = this.state.unfinishedCard;
        let copyColumns = this.state.columns;
        editedCard.description = description;
        editedCard.finished = true;
        if (editedCard.id !== -1) {
            let res = this.API.updateCard(
                editedCard.id,
                editedCard.description,
                editedCard.priority
            );
            this.setState({
                unfinishedCard: null,
                columns: copyColumns,
            });
            return;
        }

        // API call to add card and get id
        let res = await this.API.postCard(
            editedCard,
            this.state.currentProject.project_id
        );
        console.log(res);
        if (!res) {
            console.log("Error posting card");
            this.cancelCardEdit();
            return;
        }
        editedCard.id = res.content.card_id;
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
        copyColumns
            .find((col) => col.title === cancelledCard.column)
            .cards.pop();
        this.setState({
            unfinishedCard: null,
            columns: copyColumns,
        });
    }

    moveColumn(column, toRight) {
        this.setState((prevState) => {
            let copyColumns = [];
            if (prevState.unfinishedColumns.length)
                copyColumns = [...prevState.unfinishedColumns];
            else copyColumns = [...prevState.columns];
            let i = copyColumns.findIndex((c) => c.title === column);
            let newi = i;
            if (toRight) newi += 1;
            else newi -= 1;
            if (newi < 0 || newi > copyColumns.length + -1) return;
            let save = copyColumns[i];
            copyColumns[i] = copyColumns[newi];
            copyColumns[newi] = save;
            return {
                unfinishedColumns: copyColumns,
            };
        });
    }

    removeColumn(columnTitle) {
        this.setState((prevState) => {
            let copyColumns = [];
            let copyDeleted = prevState.deletedColumns;
            copyDeleted.push(columnTitle);
            if (prevState.unfinishedColumns.length)
                copyColumns = [...prevState.unfinishedColumns];
            else copyColumns = [...prevState.columns];
            let i = copyColumns.findIndex((c) => c.title === columnTitle);
            copyColumns.splice(i, 1);
            return {
                unfinishedColumns: copyColumns,
                deletedColumns: copyDeleted,
            };
        });
    }

    addColumn(columnTitle) {
        this.setState((prevState) => {
            let copyColumns = [];
            if (prevState.unfinishedColumns.length)
                copyColumns = [...prevState.unfinishedColumns];
            else copyColumns = [...prevState.columns];
            copyColumns.push(new Column(columnTitle, [], true));
            return {
                unfinishedColumns: copyColumns,
            };
        });
    }

    changeColumnTitle(oldTitle, newTitle) {
        this.setState((prevState) => {
            let copyColumns = [];
            if (prevState.unfinishedColumns.length)
                copyColumns = [...prevState.unfinishedColumns];
            else copyColumns = [...prevState.columns];
            copyColumns.find((c) => c.title === oldTitle).title = newTitle;
            return {
                unfinishedColumns: copyColumns,
            };
        });
    }

    // Called after the user clicks "Cancel" in the edit colummns menu
    cancelColumnEdit() {
        this.setState({ unfinishedColumns: [], deletedColumns: [] });
    }

    // Clear state.unfinishedColumns and call API to update the database
    // Called after the user clicks "Done" in the edit columns menu
    // This includes editing column titles, adding and deleting columns.
    async finishColumnEdit() {
        this.setState((prevState) => {
            let copyColUF = prevState.unfinishedColumns;
            if (!copyColUF.length)
                // Avoid deleting all columns by some mistake
                return;

            let { project_id } = prevState.currentProject;
            let columnNames = copyColUF.map((c) => c.title);
            this.API.updateColumnArray(
                columnNames,
                project_id,
                prevState.deletedColumns
            );
            // if res success
            return {
                unfinishedColumns: [],
                columns: copyColUF,
            };
        });
    }

    // Change card index and/or column
    async changeCardPosition(card, toColumn, toIndex = 0) {
        //console.log(card, toColumn) // Somwhere down the function these become equal
        const newColId = toColumn.id;
        const oldColId = card.columnId;
        const callAPI = async () => {
            const caCards = this.state.columns.find(
                (
                    c // <---
                ) => c.id === newColId
            ).cards;
            let cbCards = [];
            if (oldColId != newColId) {
                cbCards = this.state.columns.find((c) => c.id === oldColId)
                    .cards;
            }
            this.API.updateColsOfCards(caCards, cbCards);
        };
        if (card.columnId === toColumn.id) {
            this.setState(
                (prevState) => {
                    let copyColumns = prevState.columns;
                    let array = copyColumns.find(
                        (col) => col.id === toColumn.id
                    ).cards;
                    let fromIndex = array.findIndex((c) => c === card);
                    arraymove(array, fromIndex, toIndex);

                    array.forEach((c, index) => {
                        c.index = index;
                    });

                    return { columns: copyColumns };
                },
                () => callAPI()
            );
            return;
        }
        this.setState(
            (prevState) => {
                let copyColumns = prevState.columns;
                let toColumnObj = copyColumns.find(
                    (col) => col.id === toColumn.id
                );
                let oldColumnObj = copyColumns.find(
                    (col) => col.id === card.columnId
                );
                toColumnObj.cards.splice(toIndex, 0, card);
                card.columnId = toColumn.id; //  MOVING CARD TO A DIFFERENT COLUMN
                card.columnTitle = toColumn.title; // --||--

                var i = oldColumnObj.cards.indexOf(card);

                oldColumnObj.cards.splice(i, 1);

                toColumnObj.cards.forEach((c, index) => {
                    c.index = index;
                });
                oldColumnObj.cards.forEach((c, index) => {
                    c.index = index;
                });

                return { columns: copyColumns };
            },
            () => callAPI()
        );
    }

    async updateCardPriority(priority, card) {
        if (card.priority === priority) return;
        let copyColumns = this.state.columns;
        card.priority = priority;
        let res = await this.API.updateCard(
            card.id,
            card.description,
            priority
        );
        this.setState({
            columns: copyColumns,
        });
    }

    render() {
        const {
            columns,
            currentProject,
            unfinishedCard,
            synchronizing,
            unfinishedColumns,
        } = this.state;
        const {
            addCard,
            removeCard,
            updateCardPriority,
            makeCardEditable,
            finishCardEdit,
            cancelCardEdit,
            changeCardPosition,
            moveColumn,
            cancelColumnEdit,
            finishColumnEdit,
            removeColumn,
            addColumn,
        } = this;

        return (
            <KanbanContext.Provider
                value={{
                    columns,
                    currentProject,
                    unfinishedCard,
                    addCard,
                    removeCard,
                    makeCardEditable,
                    updateCardPriority,
                    finishCardEdit,
                    cancelCardEdit,
                    changeCardPosition,
                    moveColumn,
                    synchronizing,
                    unfinishedColumns,
                    cancelColumnEdit,
                    finishColumnEdit,
                    removeColumn,
                    addColumn,
                }}
            >
                {this.props.children}
            </KanbanContext.Provider>
        );
    }
}

export default KanbanContext;

export { KanbanContextProvider };
