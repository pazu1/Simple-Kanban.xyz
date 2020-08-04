import React from "react";

import Draggable from "react-draggable"; // The default

// On click create a draggable component
// On release check mouse position and append the column on mouse pos
// If mouse not on other column then reset
function Card(props) {
    let { description } = props.card;
    return (
        <div className="card">
            <span>{description}</span>
        </div>
    );
}

export default Card;
