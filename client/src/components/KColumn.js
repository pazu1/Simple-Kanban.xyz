import React, { useRef, useContext, useState } from "react";
import { useDrop, useDrag } from "react-dnd";
import MdArrowBack from "react-ionicons/lib/MdArrowDropleft";
import MdArrowForward from "react-ionicons/lib/MdArrowDropright";
import MdMore from "react-ionicons/lib/MdMore";

import KCard from "./KCard";
import { ItemTypes } from "../utils/const";
import KanbanContext from "./KanbanContext";
import FilterContext from "./FilterContext";
import "../styles/Kanban.scss";

function KColumn({ column, cmActivate, editColumns }) {
    const columnName = column.title;
    const {
        addCard,
        cancelCardEdit,
        unfinishedCard,
        changeCardPosition,
        moveColumn,
    } = useContext(KanbanContext);
    const cmRefColumn = useRef(null);
    const { filter } = useContext(FilterContext);
    const [dropIndex, setDropIndex] = useState(-1);
    const [disableDrop, setDisableDrop] = useState(false);
    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop: (item) => {
            if (cardComponents.length === 0) {
                // No cards in column
                changeCardPosition(item.card, column, 0);
                return;
            }
            if (disableDrop) return;
            if (dropIndex === -1) return;
            let finalIndex = dropIndex;
            if (item.card.index < dropIndex && item.card.columnId === column.id)
                finalIndex -= 1;
            changeCardPosition(item.card, column, finalIndex);
            setDropIndex(-1);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    const [{ isDragging }, dragColumn] = useDrag({
        item: {
            type: ItemTypes.COLUMN,
            column: column,
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    let style = {};
    let cards = column.cards;
    if (filter.length) {
        cards = cards.filter((card) =>
            card.description.toUpperCase().includes(filter.toUpperCase())
        );
    }
    let cardComponents = cards.map((card, index) => {
        return (
            <>
                <KCard
                    setDropIndex={setDropIndex}
                    setDisableDrop={setDisableDrop}
                    card={card}
                    cmActivate={cmActivate}
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

    const columnTitle = (
        <div className="columnTitle">
            {columnName.toUpperCase()}
            <button
                style={{ background: "transparent", padding: 0 }}
                ref={cmRefColumn}
            >
                <MdMore
                    onClick={() => cmActivate(cmRefColumn.current, column, 3)}
                    className="columnIcon--more"
                />
            </button>
        </div>
    );
    const editablecolumnTitle = (
        <div className={"editableColumn"}>
            <MdArrowBack
                onClick={() => moveColumn(column.id, false)}
                className="columnIcon--back"
            />
            {columnName.toUpperCase()}
            <MdArrowForward
                onClick={() => moveColumn(column.id, true)}
                className="columnIcon--forward"
            />
        </div>
    );

    return (
        <div
            ref={!cardComponents.length && !filter.length ? drop : null}
            className="column"
        >
            {editColumns ? editablecolumnTitle : columnTitle}
            <div
                ref={!cardComponents.length || filter.length ? null : drop}
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
                unfinishedCard.columnTitle !== columnName) &&
            !editColumns &&
            !filter.length ? (
                <button
                    className="addCardBtn"
                    onClick={() => {
                        cancelCardEdit();
                        addCard(column.id, cardComponents.length);
                    }}
                >
                    <span>Add card +</span>
                </button>
            ) : null}
        </div>
    );
}

export default KColumn;
