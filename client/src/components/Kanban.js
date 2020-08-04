import React, { useState } from "react";

import "../styles/Kanban.scss";
import Card from "./Card";

function Kanban(props) {
    let columns = Object.keys(props.columns).map((key, index) => {
        let colCards = props.cards
            .filter((card) => card.column === key)
            .map((card) => {
                return (
                    <>
                        <Card card={card}></Card>
                    </>
                );
            });

        console.log(colCards);
        return (
            <div className="column">
                {key.toUpperCase()}
                <div className="columnContent">{colCards}</div>
            </div>
        );
        //props.columns[key]
    });
    return (
        <div className="kanban">
            <div className="columnsContainer">{columns}</div>
        </div>
    );
}

export default Kanban;
