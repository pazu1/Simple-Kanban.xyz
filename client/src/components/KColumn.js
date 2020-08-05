import React from "react";
import { useDrop } from "react-dnd";

import { ItemTypes } from "../utils/const";
import "../styles/Kanban.scss";

function KColumn(props) {
    const [{ isOver, offset }, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop: (item, monitor) => {
            props.changeCardColumn(item.card.id, props.columnName);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            offset: monitor.getSourceClientOffset(), // TODO: When applied to card can be used to drop the card in the correct index
        }),
    });
    let style = {};
    if (isOver) {
        console.log(offset);
        style = {
            border: "3px solid #1C6EA4",
        };
    }

    return (
        <div className="column" ref={props.children.length === 0 ? drop : null}>
            {props.columnName.toUpperCase()}
            <div
                ref={props.children.length > 0 ? drop : null}
                style={style}
                className="columnContent"
            >
                {props.children}
            </div>
        </div>
    );
}

export default KColumn;
