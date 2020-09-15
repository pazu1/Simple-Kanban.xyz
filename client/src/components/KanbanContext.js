import React, { createContext } from "react";

import {
    arraymove,
    normalizeIndices,
    sortByIndex,
    sortAndNormalizeIndices,
} from "../utils/const";
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
        finished = true, // false if column is still being created or edited
        index,
        markDone = false
    ) {
        this.id = id;
        this.title = title;
        this.cards = cards;
        this.finished = finished;
        this.index = index;
        this.markDone = markDone;
    }
}
// This will correspond with the ones stored in the database
class Card {
    constructor(
        id, // unique key, -1 if has not been fetched from the API
        description, // text content
        index, // used to save the order of the cards to DB
        columnId, // id of the column where the card belongs to
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
            error: null,
            columns: [],
            projects: [],
            currentProject: null,
            unfinishedColumns: [], // Columns that are being edited, must be empty when editing is done TODO: DELETE, not needed
            unfinishedCard: null, // A card that is being edited
            synchronizing: true,
        };
        this.loadProject = this.loadProject.bind(this);
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
        this.changeColumnTitle = this.changeColumnTitle.bind(this);
    }

    async componentDidMount() {
        this.API = new APIConnection();
        const tokenRes = await this.API.getToken();
        if (tokenRes.status === 500) {
            this.setState({ error: 500 });
            return;
        }

        // Get projects
        let resProjects = await this.API.getProjects();
        let projects = resProjects.content.map((pr) => {
            return {
                id: pr.project_id,
                title: pr.project_name,
                lastAccessed: new Date(pr.last_accessed).getTime(),
            };
        });
        if (!projects) return;
        this.setState({ projects: projects });
        // Load first project by default, TODO: make this the last one accessed
        let lastProject = null;
        let time = 0;
        projects.forEach((pr) => {
            if (pr.lastAccessed > time) lastProject = pr;
        });

        this.loadProject(lastProject.id, lastProject.title);
    }

    async loadProject(projectId, projectName) {
        const columnsRes = await this.API.getColumns(projectId);
        console.log(projectId, columnsRes);
        if (!columnsRes.success) return;
        const columnsData = columnsRes.content;
        let project = {
            projectId: null,
            columns: [],
            projectName: "",
        };
        project.projectId = projectId;
        project.projectName = projectName;
        if (columnsRes.content.length === 0) {
            this.setState({
                currentProject: project,
                columns: [],
                synchronizing: false,
            });
            return;
        }
        project.columns = columnsData.map((pr) => {
            return new Column(
                pr.k_column_id,
                pr.title,
                [],
                true,
                pr.index,
                pr.k_column_id
            );
        });

        let resCards = await this.API.getCards(project.projectId);
        console.log(project.columns);
        let fetchedCards = resCards.content;
        let cards = [];
        console.log(fetchedCards);
        if (fetchedCards.length) {
            cards = fetchedCards
                .map((c) => {
                    return new Card(
                        c.card_id,
                        c.description,
                        c.k_index,
                        c.k_column_id,
                        c.k_priority
                    );
                })
                .sort(sortByIndex);
        }
        sortAndNormalizeIndices(project.columns);
        project.columns.forEach((col, i) => {
            cards.forEach((c) => {
                if (c.columnId === col.id) {
                    project.columns[i].cards.push(c);
                }
            });
        });

        if (!resCards) return;

        this.setState({
            currentProject: project,
            columns: project.columns,
            synchronizing: false,
        });
    }

    // Add a rendered card (to the current project)
    addCard(columnId, index) {
        console.log(columnId, "COLID");
        this.setState((prevState) => {
            let copyColumns = prevState.columns;
            console.log(prevState.columns);
            let copyColumn = copyColumns.find((col) => col.id === columnId);
            const card = new Card(-1, "", index, columnId, 1, false);
            copyColumn.cards.push(card);
            return { columns: copyColumns, unfinishedCard: card };
        });
    }

    async removeCard(card) {
        // TODO: wrap in setState
        let res = await this.API.deleteCard(card.id);
        let copyColumns = this.state.columns;
        let cardColumn = copyColumns.find((col) => col.id === card.columnId)
            .cards;
        cardColumn.splice(cardColumn.indexOf(card), 1);
        if (cardColumn.length) {
            normalizeIndices(cardColumn);
            let res = await this.API.updateColsOfCards(cardColumn, []); // Update the indices
        }
        this.setState({ columns: copyColumns }); // TODO: return
    }

    makeCardEditable(card) {
        card.finished = false;
        this.setState({ unfinishedCard: card });
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

        let res = await this.API.postCard(
            editedCard,
            this.state.currentProject.projectId
        );
        if (!res.success) {
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
            .find((col) => col.id === cancelledCard.columnId)
            .cards.pop();
        this.setState({
            unfinishedCard: null,
            columns: copyColumns,
        });
    }

    moveColumn(columnId, toRight) {
        this.setState((prevState) => {
            let copyColumns = [];
            if (prevState.unfinishedColumns.length)
                copyColumns = [...prevState.unfinishedColumns];
            else copyColumns = [...prevState.columns];

            let movedCol = copyColumns.find((c) => c.id === columnId);
            const oldi = movedCol.index;
            let newi = oldi;
            if (toRight) newi += 1;
            else newi -= 1;
            if (newi < 0 || newi > copyColumns.length + -1)
                // out of bounds
                return;
            let replacedCol = copyColumns.find((c) => c.index === newi);

            // Swap indices
            replacedCol.index = oldi;
            movedCol.index = newi;
            console.log(replacedCol, movedCol);

            return {
                unfinishedColumns: copyColumns,
            };
        });
    }

    async removeColumn(columnId) {
        const res = await this.API.deleteColumn(columnId);
        if (!res.success) return;
        this.setState((prevState) => {
            let copyColumns = prevState.columns;
            let i = copyColumns.findIndex((c) => c.id === columnId);
            copyColumns.splice(i, 1);
            normalizeIndices(copyColumns);
            return { columns: copyColumns };
        });
    }

    async addColumn(columnTitle) {
        let copyColumns = this.state.columns;
        const newIndex = copyColumns.length;
        const res = await this.API.postColumn(
            columnTitle,
            newIndex,
            this.state.currentProject.projectId
        );
        if (!res.success) return;
        const id = res.content.k_column_id;
        copyColumns.push(new Column(id, columnTitle, [], true, newIndex));
        this.setState({
            columns: copyColumns,
        });
    }

    async changeColumnTitle(columnId, newTitle) {
        const res = await this.API.updateColumns(
            [{ id: columnId, title: newTitle, index: null }],
            this.state.currentProject.projectId
        );
        if (!res.success) return;

        this.setState((prevState) => {
            let copyColumns = prevState.columns;
            copyColumns.find((c) => c.id === columnId).title = newTitle;
            return {
                columns: copyColumns,
            };
        });
    }

    // Called after the user clicks "Cancel" in the edit colummns menu
    cancelColumnEdit() {
        this.setState({ unfinishedColumns: [] });
    }

    // Clear state.unfinishedColumns and call API to update the database
    // this only handles changing column indices,
    // TODO: remember to make this update the indices of all columns in the project
    // TODO: refactor
    async finishColumnEdit() {
        let copyColFinished = this.state.unfinishedColumns;
        if (!copyColFinished.length) return;
        const res = await this.API.updateColumns(
            copyColFinished,
            this.state.projectId
        );

        this.setState((prevState) => {
            // this.API.updateColumns
            // ^ add all columns in the project to this array
            // if res success
            return {
                unfinishedColumns: [],
                columns: copyColFinished,
            };
        });
    }

    // Change card index and/or column
    async changeCardPosition(card, toColumn, toIndex = 0) {
        const newColId = toColumn.id; // make sure these two stay constant
        const oldColId = card.columnId;

        const callAPI = async () => {
            const caCards = this.state.columns.find((c) => c.id === newColId)
                .cards;
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

                    normalizeIndices(array);

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

                normalizeIndices(toColumnObj.cards);
                normalizeIndices(oldColumnObj.cards);

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
            projects,
            currentProject,
            unfinishedCard,
            synchronizing,
            unfinishedColumns,
            error,
        } = this.state;
        const {
            loadProject,
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
            changeColumnTitle,
        } = this;

        return (
            <KanbanContext.Provider
                value={{
                    error,
                    columns,
                    projects,
                    currentProject,
                    unfinishedCard,
                    loadProject,
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
                    changeColumnTitle,
                }}
            >
                {this.props.children}
            </KanbanContext.Provider>
        );
    }
}

export default KanbanContext;

export { KanbanContextProvider };
