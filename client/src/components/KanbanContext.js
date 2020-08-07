import React, { createContext } from "react";

const KanbanContext = createContext();

const API_URL = "api/";
const JWT = "jwt";
const CARDS = "cards";

// This will correspond with the ones stored in the database
class Card {
    constructor(
        id, // corresponds to DB id, no reason to diplay to user
        description,
        index, // used to save the order of the cards to DB
        column, // possible values eg. backlog, todo, doing...
        urgency // integer between like 0 - 4
    ) {
        this.id = id;
        this.description = description;
        this.index = index;
        this.column = column;
        this.urgency = urgency;
    }
}

function getTestCards() {
    return [
        new Card(1, "Do thing", 0, "todo"),
        new Card(2, "Do stuff", 1, "todo"),
        new Card(3, "afhgjgsf", 2, "todo"),
        new Card(4, "Plan stuff", 0, "backlog"),
        new Card(6, "Stuff being done", 0, "doing"),
        new Card(9, "Stuff being done 2", 1, "doing"),
        new Card(12, "Running tests", 0, "testing"),
        new Card(43, "Running tests 2", 1, "testing"),
        new Card(92, "Running tests 3", 2, "testing"),
        new Card(99, "Done", 0, "done"),
        new Card(95, "More done", 1, "done"),
        new Card(52, "Done 2", 2, "done"),
        new Card(32, "Done 3", 3, "done"),
    ];
}

class KanbanContextProvider extends React.Component {
    constructor(props) {
        super();
        const cards = getTestCards();
        this.state = {
            columns: {},
        };
        this.changeCardColumn = this.changeCardColumn.bind(this);
    }

    componentDidMount() {
        // TODO: replace placeholders with API calls
        let cards = getTestCards();
        cards.sort((ca, cb) => {
            let a = ca.index;
            let b = cb.index;
            return a < b ? -1 : a > b ? 1 : 0;
        });

        // get columns for selected project
        let tstArray = ["backlog", "todo", "doing", "testing", "done"];

        let columns = {};
        tstArray.forEach((col) => {
            columns[col] = [];
            cards.forEach((c) => {
                if (c.column === col) {
                    columns[col].push(c);
                }
            });
        });
        this.setState({ columns: columns }, () => console.log(this.state));
    }

    changeCardColumn(card, toColumn, toIndex = 0) {
        console.log(toColumn);
        this.setState(
            (prevState) => {
                let oldColumn = card.column;
                let copyColumns = prevState.columns;
                copyColumns[toColumn].splice(toIndex, 0, card);
                card.column = toColumn;

                var i = copyColumns[oldColumn].indexOf(card);
                copyColumns[oldColumn].splice(i, 1);

                return { columns: copyColumns };
            },
            () => console.log(this.state.columns[toColumn])
        );
    }

    changeCardIndex(card, toIndex) {}

    //
    // API access
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

    async getCards() {
        fetch(API_URL + CARDS)
            .then((res) => res.text())
            .then((res) => console.log(res))
            .catch((err) => err);
    }

    async addCard(description) {
        const requestConf = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description: description }),
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
        const { changeCardColumn } = this;

        return (
            <KanbanContext.Provider
                value={{
                    columns,
                    changeCardColumn,
                }}
            >
                {this.props.children}
            </KanbanContext.Provider>
        );
    }
}

export default KanbanContext;

export { KanbanContextProvider };
