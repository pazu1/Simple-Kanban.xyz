import React from "react";
import { useDrag } from "react-dnd";

import { ItemTypes } from "../utils/const";

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
            <div
                className="dropSpot"
                style={{ height: props.isDraggedOn && !isDragging ? null : 0 }}
            ></div>
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
