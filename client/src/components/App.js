import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import "../styles/Index.scss";
import Index from "./Index";
import BoardView from "./BoardView";
import NotificationBar from "./NotificationBar";
import { KanbanContextProvider } from "./KanbanContext";
import { SettingsContextProvider } from "./SettingsContext";
function App() {
    return (
        <KanbanContextProvider>
            <Router>
                <Switch>
                    <Route path="/board">
                        <SettingsContextProvider>
                            <BoardView />
                        </SettingsContextProvider>
                    </Route>
                    <Route path="/">
                        <Index />
                    </Route>
                </Switch>
            </Router>
            <NotificationBar />
        </KanbanContextProvider>
    );
}

export default App;
