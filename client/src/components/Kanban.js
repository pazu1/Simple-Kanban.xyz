import React, { useState, useContext } from "react";

import "../styles/Kanban.scss";
import KColumn from "./KColumn";
import KanbanContext from "./KanbanContext";

function Kanban(props) {
    const { columns } = useContext(KanbanContext);

    let columnComponents = Object.keys(columns).map((key) => {
        return <KColumn columnName={key} />;
    });
    return (
        <div className="kanban">
            <div className="columnsContainer">{columnComponents}</div>
        </div>
    );
}

export default Kanban;
