import React, { useContext, useState } from "react";

import { ItemTypes } from "../utils/const";
import KCard from "./KCard";
import "../styles/Kanban.scss";

function KColumn(props) {
    let style = {};
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
