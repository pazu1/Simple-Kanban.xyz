import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./App.css";
import Kanban from "./Kanban";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import { KanbanContextProvider } from "./KanbanContext";

function App(props) {
    return (
        <div>
            <DndProvider backend={HTML5Backend}>
                <KanbanContextProvider>
                    <TopBar />
                    <SideBar />
                    <Kanban />
                </KanbanContextProvider>
            </DndProvider>
        </div>
    );
}

export default App;
