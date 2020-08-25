import React, { useContext, useState } from "react";
import { useDrop, useDrag } from "react-dnd";
import MdArrowBack from "react-ionicons/lib/MdArrowDropleft";
import MdArrowForward from "react-ionicons/lib/MdArrowDropright";
import MdMore from "react-ionicons/lib/MdMore";

import KCard from "./KCard";
import { ItemTypes } from "../utils/const";
import KanbanContext from "./KanbanContext";
import "../styles/Kanban.scss";

function KColumn({ columnName, cmToggle, editColumns }) {
    const {
        addCard,
        cancelCardEdit,
        unfinishedCard,
        columns,
        changeCardPosition,
    } = useContext(KanbanContext);
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
            changeCardPosition(item.card, columnName, finalIndex);
            setDropIndex(-1);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    const [{ isDragging }, dragColumn] = useDrag({
        item: {
            type: ItemTypes.COLUMN,
            column: columnName,
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
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

    const swapColumns = () => {
        console.log(columns);
    };

    let columnTitle = <div>{columnName.toUpperCase()}</div>;

    if (editColumns)
        columnTitle = (
            <div className={"editableColumn"} ref={dragColumn}>
                <MdArrowBack
                    onClick={swapColumns}
                    className="columnIcon--back"
                />
                {columnName.toUpperCase()}
                <MdMore className="columnIcon--more" />
                <MdArrowForward
                    onClick={swapColumns}
                    className="columnIcon--forward"
                />
            </div>
        );

    return (
        <div ref={cardComponents.length === 0 ? drop : null} className="column">
            {columnTitle}
            <div
                ref={cardComponents.length === 0 ? null : drop}
                style={editColumns ? { display: "none" } : style}
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
            {(unfinishedCard === null ||
                unfinishedCard.column !== columnName) &&
            !editColumns ? (
                <button
                    className="addCardBtn"
                    onClick={() => {
                        cancelCardEdit();
                        addCard(columnName, cardComponents.length);
                    }}
                >
                    <span>Add card +</span>
                </button>
            ) : null}
        </div>
    );
}

export default KColumn;
