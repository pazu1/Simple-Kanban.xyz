import React, { useContext, useState } from "react";

import { ItemTypes } from "../utils/const";
import KCard from "./KCard";
import KanbanContext from "./KanbanContext";
import "../styles/Kanban.scss";

function KColumn(props) {
    const { columns } = useContext(KanbanContext);
    let style = {};
    let cardComponents = columns[props.columnName].map((card, index) => {
        return <KCard card={card}></KCard>;
    });

    return (
        <div className="column">
            {props.columnName.toUpperCase()}
            <div style={style} className="columnContent">
                {cardComponents}
                <div
                    className="dropSpot"
                    style={{ height: false ? null : 0 }}
                />
            </div>
            <div className="addCardBtn">
                <span>Add card +</span>
            </div>
        </div>
    );
}

export default KColumn;
