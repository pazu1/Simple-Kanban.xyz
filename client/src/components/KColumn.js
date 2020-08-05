import React from "react";
import { useDrop } from "react-dnd";

import { ItemTypes } from "../utils/const";
import "../styles/Kanban.scss";

function KColumn(props) {
    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop: (item, monitor) => {
            props.changeCardColumn(item.card.id, props.columnName);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });
    let style = {};
    if (isOver) {
        style = {
            border: "3px solid #1C6EA4",
        };
    }
    return (
        <div ref={drop} className="column">
            {props.columnName.toUpperCase()}
            <div style={style} className="columnContent">
                {props.children}
            </div>
        </div>
    );
}

export default KColumn;
