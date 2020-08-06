import React, { useContext, useState } from "react";
import { useDrop } from "react-dnd";
import KanbanContext from "./KanbanContext";

import { ItemTypes } from "../utils/const";
import KCard from "./KCard";
import "../styles/Kanban.scss";

function KColumn(props) {
    const { changeCardColumn } = useContext(KanbanContext);
    const [dropIndex, setDropIndex] = useState(-1);

    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop: (item, monitor) => {
            changeCardColumn(item.card.id, props.columnName, dropIndex, () =>
                setDropIndex(-1)
            );
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
    props.columnCards.sort((ca, cb) => {
        let a = ca.index;
        let b = cb.index;
        return a < b ? -1 : a > b ? 1 : 0;
    });
    const badIndex = props.columnCards.filter((c) => c.index === 0).length > 1; // XXX: only needed with test cards
    let cardComponents = props.columnCards.map((card, index) => {
        if (badIndex) {
            card.index = index;
        }
        return (
            <KCard
                ref={drop}
                card={card}
                setDropIndex={setDropIndex}
                isDraggedOn={card.index === dropIndex && isOver}
            ></KCard>
        );
    }); // TODO: push a +card component as last item

    return (
        <div className="column" ref={props.children.length === 0 ? drop : null}>
            {props.columnName.toUpperCase()}
            <div
                ref={props.children.length > 0 ? drop : null}
                style={style}
                className="columnContent"
            >
                {cardComponents}
            </div>
        </div>
    );
}

export default KColumn;
