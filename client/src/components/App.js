import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import "../styles/Index.scss";
import Index from "./Index";
import BoardView from "./BoardView";
import { KanbanContextProvider } from "./KanbanContext";
function App() {
    return (
        <KanbanContextProvider>
            <Router>
                <Switch>
                    <Route path="/board">
                        <BoardView />
                    </Route>
                    <Route path="/">
                        <Index />
                    </Route>
                </Switch>
            </Router>
        </KanbanContextProvider>
    );
}

export default App;
