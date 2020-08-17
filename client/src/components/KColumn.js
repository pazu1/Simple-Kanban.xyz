import React, { useContext, useState } from "react";
import { useDrop } from "react-dnd";

import KCard from "./KCard";
import { ItemTypes } from "../utils/const";
import KanbanContext from "./KanbanContext";
import "../styles/Kanban.scss";

function KColumn({ columnName, cmToggle }) {
    const { columns, changeCardPosition } = useContext(KanbanContext);
    const [dropIndex, setDropIndex] = useState(-1);
    const [disableDrop, setDisableDrop] = useState(false);
    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop: (item) => {
            if (cardComponents.length === 0) {
                // No cards in column
                changeCardPosition(item.card, columnName, 0);
                return;
            }
            if (disableDrop) return;
            if (dropIndex === -1) return;
            let finalIndex = dropIndex;
            if (item.card.index < dropIndex && item.card.column === columnName)
                finalIndex -= 1;
            console.log(finalIndex);
            changeCardPosition(item.card, columnName, finalIndex);
            setDropIndex(-1);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });
    let style = {};
    let cardComponents = columns[columnName].map((card, index) => {
        return (
            <>
                <KCard
                    setDropIndex={setDropIndex}
                    setDisableDrop={setDisableDrop}
                    card={card}
                    cmToggle={cmToggle}
                ></KCard>
                <div
                    className="dropSpot"
                    style={{
                        height:
                            dropIndex === index + 1 && !disableDrop && isOver
                                ? null
                                : 0,
                    }}
                ></div>
            </>
        );
    });

    return (
        <div ref={cardComponents.length === 0 ? drop : null} className="column">
            {columnName.toUpperCase()}
            <div
                ref={cardComponents.length === 0 ? null : drop}
                style={style}
                className="columnContent"
            >
                <div
                    className="dropSpot"
                    style={{
                        height:
                            (dropIndex === 0 && !disableDrop && isOver) ||
                            (cardComponents.length === 0 && isOver)
                                ? null
                                : 0,
                    }}
                ></div>
                {cardComponents}
            </div>
            <button className="addCardBtn">
                <span>Add card +</span>
            </button>
        </div>
    );
}

export default KColumn;
