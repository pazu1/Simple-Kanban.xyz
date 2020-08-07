import React, { useState, useContext, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

import KanbanContext from "./KanbanContext";
import { ItemTypes } from "../utils/const";

function KCard(props) {
    const { changeCardColumn } = useContext(KanbanContext);
    let { description, id, index, column } = props.card;
    const [dropAfterCard, setDropAfterCard] = useState(false);
    const ref = useRef(null);

    const [{ isDragging }, drag] = useDrag({
        item: {
            type: ItemTypes.CARD,
            card: props.card,
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop: (item, monitor) => {
            let droppedNewIndex = index;
            if (dropAfterCard) {
                droppedNewIndex += 1;
            }

            // if dropped in the same place
            if (item.card.column === column) {
                if (
                    item.card.index === droppedNewIndex ||
                    (item.card.index === 0 && droppedNewIndex === 1)
                ) {
                    return;
                }
            }

            console.log(droppedNewIndex);
            changeCardColumn(item.card.id, column, droppedNewIndex);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            if (item.card.index === index && item.card.column === column) {
                // hovering over itself
                return;
            }

            const hoverRect = ref.current.getBoundingClientRect();
            const hoverMidY = (hoverRect.bottom - hoverRect.top) / 2;
            const mousePos = monitor.getClientOffset();
            const hoverClientY = mousePos.y - hoverRect.top;
            if (hoverClientY > hoverMidY) {
                setDropAfterCard(true);
            } else {
                setDropAfterCard(false);
            }
        },
    });

    drag(drop(ref));

    return (
        <>
            <div
                className="dropSpot"
                style={{ height: isOver && !dropAfterCard ? null : 0 }}
            ></div>
            <div
                ref={ref}
                style={{ opacity: isDragging ? 0.4 : 1 }}
                className="card"
            >
                <span>{description}</span>
            </div>
            <div
                className="dropSpot"
                style={{ height: isOver && dropAfterCard ? null : 0 }}
            ></div>
        </>
    );
}

export default KCard;
