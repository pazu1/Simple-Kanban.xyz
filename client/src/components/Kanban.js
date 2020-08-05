import React, { useState } from "react";

import "../styles/Kanban.scss";
import KCard from "./KCard";
import KColumn from "./KColumn";

function Kanban(props) {
    // When a card is picked up it is stored here for the time
    const [draggedCard, setDraggedCard] = useState(null);

    const createDrag = () => {
        console.log("dragging");
        setDraggedCard(true);
    };

    let columns = Object.keys(props.columns).map((key) => {
        let colCards = props.cards
            .filter((card) => card.column === key)
            .map((card, index) => {
                // TODO: sort by card.index index here
                card.index = index;
                return <KCard card={card}></KCard>;
            });

        console.log(colCards);
        return (
            <KColumn changeCardColumn={props.changeCardColumn} columnName={key}>
                {colCards}
            </KColumn>
        );
        //props.columns[key]
    });
    return (
        <div className="kanban">
            <div className="columnsContainer">{columns}</div>
        </div>
    );
}

export default Kanban;
