import React from "react";
import "./App.css";

const API_URL = "api/";
const JWT = "jwt";
const CARDS = "cards";

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            cardnum: 0,
        };
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

        fetch(API_URL + CARDS + `/${id}`, requestConf)
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

        fetch(API_URL + CARDS + `/${id}`, requestConf)
            .then((res) => res.json())
            .then((resJson) => console.log(resJson))
            .catch((err) => err);
    }

    componentDidMount() {}

    render() {
        return (
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
        );
    }
}

export default App;
