import React, { useContext } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import Kanban from "./Kanban";
import TopBar from "./TopBar";
import LoadingScreen from "./LoadingScreen";
import KanbanContext, { LoadingType } from "./KanbanContext";

function BoardView(props) {
    const { loading } = useContext(KanbanContext);

    return (
        <div>
            {loading !== LoadingType.NONE ? (
                <LoadingScreen />
            ) : (
                <DndProvider backend={HTML5Backend}>
                    <TopBar />
                    <Kanban />
                </DndProvider>
            )}
        </div>
    );
}

export default BoardView;
