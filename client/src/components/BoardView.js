import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Kanban from "./Kanban";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import { FilterContextProvider } from "./FilterContext";

function BoardView(props) {
    return (
        <div>
            <DndProvider backend={HTML5Backend}>
                <FilterContextProvider>
                    <TopBar />
                    <Kanban />
                </FilterContextProvider>
            </DndProvider>
        </div>
    );
}

export default BoardView;
