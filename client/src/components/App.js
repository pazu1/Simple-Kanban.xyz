import React, { createContext } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./App.css";
import Kanban from "./Kanban";
import SideBar from "./SideBar";
import { KanbanContextProvider } from "./KanbanContext";

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
