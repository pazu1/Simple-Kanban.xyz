import React from "react";
import "./App.css";

const API_URL = "api/";
const JWT = "jwt";
const CARDS = "cards";

class App extends React.Component {
    constructor() {
        super();

        this.state = {
            apiResponse: "",
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

    async callAPI() {
        fetch(API_URL + CARDS)
            .then((res) => res.text())
            .then((res) => console.log(res))
            .catch((err) => err);
    }

    componentDidMount() {
        this.callAPI();
    }

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
                        this.callAPI();
                    }}
                >
                    Call database
                </button>
            </div>
        );
    }
}

export default App;
