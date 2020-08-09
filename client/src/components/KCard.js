import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

import { ItemTypes, PriorityLevels } from "../utils/const";

function KCard({ card, setDisableDrop, setDropIndex }) {
    const { priority, description, id, index, column } = card;
    const ref = useRef(null);
    let dropAfterCard = false;
    let dropIndex = null;

    const [{ isDragging }, drag] = useDrag({
        item: {
            type: ItemTypes.CARD,
            card: card,
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.CARD,
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
        hover(item, monitor) {
            const hoverRect = ref.current.getBoundingClientRect();
            const hoverMidY = (hoverRect.bottom - hoverRect.top) / 2;
            const mousePos = monitor.getClientOffset();
            const hoverClientY = mousePos.y - hoverRect.top;
            if (hoverClientY > hoverMidY) {
                dropAfterCard = true;
            } else {
                dropAfterCard = false;
            }

            dropIndex = index;
            if (dropAfterCard) {
                dropIndex += 1;
            }

            if (column === item.card.column)
                if (
                    (index - item.card.index === 1 && !dropAfterCard) ||
                    (index - item.card.index === -1 && dropAfterCard) ||
                    item.card.index === index
                ) {
                    setDisableDrop(true);
                    return;
                }
            setDisableDrop(false);
            setDropIndex(dropIndex);
        },
    });

    drag(drop(ref));
    let priorityText = PriorityLevels[priority];

    return (
        <div>
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
        </div>
    );
}

export default KCard;
