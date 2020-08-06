import React, { useState, useContext } from "react";

import "../styles/Kanban.scss";
import KCard from "./KCard";
import KColumn from "./KColumn";
import KanbanContext from "./KanbanContext";

function Kanban(props) {
    const { cards, columns, changeCardColumn } = useContext(KanbanContext);

    // When a card is picked up it is stored here for the time
    const [draggedCard, setDraggedCard] = useState(null);

    const createDrag = () => {
        console.log("dragging");
        setDraggedCard(true);
    };

    let columnComponents = Object.keys(columns).map((key) => {
        let colCards = cards.filter((card) => card.column === key);

        return (
            <KColumn columnName={key} columnCards={colCards}>
                {colCards}
            </KColumn>
        );
        //props.columns[key]
    });
    return (
        <div className="kanban">
            <div className="columnsContainer">{columnComponents}</div>
        </div>
    );
}

export default Kanban;
