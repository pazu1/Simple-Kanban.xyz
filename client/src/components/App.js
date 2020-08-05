import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./App.css";
import Kanban from "./Kanban";
import SideBar from "./SideBar";

const API_URL = "api/";
const JWT = "jwt";
const CARDS = "cards";

// This will correspond with the ones stored in the database
class Card {
    constructor(
        id, // corresponds to DB id, no reason to diplay to user
        description,
        index, // visual position in the column it is in currently
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
        new Card(2, "Do stuff", 0, "todo"),
        new Card(3, "afhgjgsf", 0, "todo"),
        new Card(4, "Plan stuff", 0, "backlog"),
        new Card(6, "Stuff being done", 0, "doing"),
        new Card(9, "Stuff being done 2", 0, "doing"),
        new Card(12, "Running tests", 0, "testing"),
        new Card(43, "Running tests 2", 0, "testing"),
        new Card(92, "Running tests 3", 0, "testing"),
        new Card(99, "Done", 0, "done"),
        new Card(95, "More done", 0, "done"),
        new Card(52, "Done 2", 0, "done"),
        new Card(32, "Done 3", 0, "done"),
    ];
}

class App extends React.Component {
    // TODO: add all card and API operations to a context to reduce drilling
    constructor() {
        super();

        let cards = getTestCards();
        this.state = {
            columns: {},
            cards: cards,
        };
        this.changeCardColumn = this.changeCardColumn.bind(this);
    }

    changeCardColumn(id, toColumn, toIndex = 0) {
        this.setState((prevState) => {
            let copyCards = [...prevState.cards];
            copyCards[copyCards.findIndex((c) => c.id == id)].column = toColumn;
            return { cards: copyCards };
        });
    }

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

    componentDidMount() {
        // get columns for selected project
        let tstArray = ["backlog", "todo", "doing", "testing", "done"];

        let columns = {};
        tstArray.forEach((col) => {
            columns[col] = [];
        });
        this.setState({ columns: columns }, () => console.log(this.state));
    }

    render() {
        return (
            <div>
                <DndProvider backend={HTML5Backend}>
                    <Kanban
                        columns={this.state.columns}
                        cards={this.state.cards}
                        removeArrayCard={this.removeArrayCard}
                        changeCardColumn={this.changeCardColumn}
                    />
                    <SideBar />
                </DndProvider>
            </div>
        );
    }
}
/*
            <div className="App">
                <button
                    onClick={() => {
                        this.getJwt();
                    }}
                >
                    Get token
                </button>
                <button
                    onClick={() => {
                        this.getCards();
                    }}
                >
                    Get cards
                </button>
                <button
                    onClick={() => {
                        this.addCard();
                    }}
                >
                    Add card
                </button>
                <button
                    onClick={() => {
                        this.deleteCard(this.state.cardnum);
                    }}
                >
                    Delete card
                </button>
                <input
                    value={this.state.cardnum}
                    onChange={(event) =>
                        this.setState({ cardnum: event.target.value })
                    }
                />
            </div>
            */

export default App;
