import React from "react";
import { useDrag } from "react-dnd";

import { ItemTypes } from "../utils/const";

// On click create a draggable component
// On release check mouse position and append the column on mouse pos
// If mouse not on other column then reset
function KCard(props) {
    const [{ isDragging }, drag] = useDrag({
        item: {
            type: ItemTypes.CARD,
            card: props.card,
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    let { description, id, index } = props.card;

    return (
        <>
            <button style={{ display: props.isDraggedOn ? null : "none" }}>
                Drop here
            </button>
            <div
                ref={drag}
                style={{ opacity: isDragging ? 0.4 : 1 }}
                className="card"
                onDragEnter={() => {
                    props.setDropIndex(index);
                }}
            >
                <span>{description}</span>
            </div>
        </>
    );
}

export default KCard;
