import React, { useState, useRef, useContext } from "react";
import { useDrag, useDrop } from "react-dnd";
import MdMore from "react-ionicons/lib/MdMore";
import MdCheckmark from "react-ionicons/lib/MdCheckmark";
import MdClose from "react-ionicons/lib/MdClose";

import { ItemTypes, PriorityLevels } from "../utils/const";
import KanbanContext from "./KanbanContext";

function KCard({ card, setDisableDrop, setDropIndex, cmActivate }) {
    const { finishCardEdit, cancelCardEdit } = useContext(KanbanContext);
    const { priority, description, id, index, column } = card;
    const ref = useRef(null);
    const moreBtnRef = useRef(null);
    const priLabelRef = useRef(null);
    let formRef = useRef(null);
    const [editFormDesc, setEditFormDesc] = useState();
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

    if (isDragging) {
        cancelCardEdit();
    }

    const handleFormSubmit = () => {
        finishCardEdit(editFormDesc);
    };

    let priorityText = PriorityLevels[priority];
    let displayContents = (
        <>
            <div className={`priorityLabel--${priorityText}`}>
                {priorityText}
            </div>
            <span>
                <form ref={(e) => (formRef = e)} onSubmit={handleFormSubmit}>
                    <textarea
                        autoFocus
                        className="cardTextArea"
                        type="text"
                        onChange={(e) => setEditFormDesc(e.target.value)}
                        value={editFormDesc}
                    />
                </form>
            </span>
        </>
    );

    if (card.finished) {
        drag(drop(ref));
        displayContents = (
            <>
                <div
                    ref={priLabelRef}
                    className={`priorityLabel--${priorityText}`}
                    onClick={() => {
                        cmActivate(priLabelRef.current, card, 0);
                    }}
                >
                    {priorityText}
                </div>
                <button
                    ref={moreBtnRef}
                    onClick={(e) => {
                        cmActivate(moreBtnRef.current, card, 1);
                    }}
                    className="cardMenuBtn"
                >
                    <MdMore className="ionIcon" fontSize={16} />
                </button>
                <span>{description}</span>
            </>
        );
    }

    if (isDragging) displayContents = <div className="draggedCardPlace"></div>;

    return (
        <div>
            <div
                ref={ref}
                style={{ opacity: isDragging ? 0.4 : 1 }}
                className={
                    isDragging
                        ? "card--dragging"
                        : !card.finished
                        ? "card--editing"
                        : "card"
                }
            >
                {displayContents}
            </div>
            {!card.finished ? (
                <>
                    <button
                        onClick={cancelCardEdit}
                        className="cancelSubmitButton"
                    >
                        <MdClose className="circleIonIcon" color={"#fff"} />
                    </button>
                    <button
                        onClick={() => {
                            formRef.dispatchEvent(new Event("submit"));
                        }}
                        style={{ background: !editFormDesc ? "#a1a1a1" : null }}
                        disabled={!editFormDesc}
                        className="submitButton"
                    >
                        <MdCheckmark className="circleIonIcon" color={"#fff"} />
                    </button>
                </>
            ) : null}
        </div>
    );
}

export default KCard;
