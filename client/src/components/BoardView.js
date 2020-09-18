import React, { useContext } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Kanban from "./Kanban";
import TopBar from "./TopBar";
import LoadingScreen from "./LoadingScreen";
import { FilterContextProvider } from "./FilterContext";
import KanbanContext from "./KanbanContext";

function BoardView(props) {
    const { loading } = useContext(KanbanContext);

    return (
        <div>
            {loading ? (
                <LoadingScreen />
            ) : (
                <DndProvider backend={HTML5Backend}>
                    <FilterContextProvider>
                        <TopBar />
                        <Kanban />
                    </FilterContextProvider>
                </DndProvider>
            )}
        </div>
    );
}

export default BoardView;
