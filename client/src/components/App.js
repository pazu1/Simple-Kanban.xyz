import React from "react";
import "./App.css";

const API_URL = "api/"
const JWT = "/jwt"

class App extends React.Component {
    constructor() {
        super();

        const storedJwt = localStorage.getItem("token")

        this.state = { 
            apiResponse: "",
            jwt: storedJwt || null // double check if this even works
        };
    }

    async getJwt() {
        fetch(API_URL+JWT)
            .then((res) => res.json())
            .then((res) => {
                this.setState({ jwt: res })
                console.log(res)
            })
    }

    callAPI() {
        fetch(API_URL)
            .then((res) => res.text())
            .then((res) => this.setState({ apiResponse: res }))
            .catch((err) => err);
    }

    componentDidMount() {
        this.callAPI();
    }

    render() {
        return (
            <div className="App">
                    <button
                        onClick={ () => {
                            console.log("retrieve token")
                            this.getJwt()
                        }}
                    >Get token</button>
                    <button
                        onClick={ () => {
                            console.log("call api")
                        }}
                    >Call database</button>
            </div>
        );
    }
}

export default App;
