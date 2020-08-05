import React, { createContext } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./App.css";
import Kanban from "./Kanban";
import SideBar from "./SideBar";
import { KanbanContextProvider } from "./KanbanContext";

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

function App(props) {
    return (
        <div>
            <DndProvider backend={HTML5Backend}>
                <KanbanContextProvider>
                    <Kanban />
                    <SideBar />
                </KanbanContextProvider>
            </DndProvider>
        </div>
    );
}

export default App;
