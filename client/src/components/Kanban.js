import React, { useContext } from "react";

import "../styles/Kanban.scss";
import KColumn from "./KColumn";
import KanbanContext from "./KanbanContext";

function Kanban(props) {
    const { columns, getCards } = useContext(KanbanContext);

    let columnComponents = Object.keys(columns).map((key) => {
        return <KColumn columnName={key} />;
    });
    return (
        <>
            <button onClick={() => getCards()}>Test API</button>
            <div className="kanban">
                <div className="columnsContainer">{columnComponents}</div>
            </div>
        </>
    );
}

export default Kanban;
