import React, { useState, useContext, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

import KanbanContext from "./KanbanContext";
import { ItemTypes, PriorityLevels } from "../utils/const";

function KCard(props) {
    const { changeCardPosition } = useContext(KanbanContext);
    const { priority, description, id, index, column } = props.card;
    const [dropAfterCard, setDropAfterCard] = useState(false);
    const ref = useRef(null);
    const [disableDrop, setDisableDrop] = useState(true);

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
                if (item.card.index === droppedNewIndex) {
                    return;
                }
                if (droppedNewIndex > item.card.index) {
                    droppedNewIndex -= 1;
                }
            }

            changeCardPosition(item.card, column, droppedNewIndex);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
        hover(item, monitor) {
            if (
                // Hovered over a drop zone of the same index
                item.card.column === column &&
                ((index - item.card.index === 1 && !dropAfterCard) ||
                    (index - item.card.index === -1 && dropAfterCard) ||
                    item.card.index === index)
            ) {
                setDisableDrop(true);
            } else setDisableDrop(false);

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

    const enableDrop = isOver && !disableDrop;
    let priorityText = PriorityLevels[priority];

    return (
        <div>
            <div
                className="dropSpot"
                style={{ height: enableDrop && !dropAfterCard ? null : 0 }}
            ></div>
            <div
                ref={ref}
                style={{ opacity: isDragging ? 0.4 : 1 }}
                className="card"
            >
                <div className={`priorityLabel--${priorityText}`}>
                    {priorityText}
                </div>
                <span>{description}</span>
            </div>
            <div
                className="dropSpot"
                style={{ height: enableDrop && dropAfterCard ? null : 0 }}
            ></div>
        </div>
    );
}

export default KCard;
