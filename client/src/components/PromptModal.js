import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";

import "../styles/Modal.scss";
import KanbanContext from "./KanbanContext";

export const promptTypes = {
    ADDING_COLUMN: 0,
    DELETING_COLUMN: 1,
    EDITING_COLUMN: 2,
    CREATING_PROJECT: 3,
};

function PromptModal(props) {
    const { modalOpen, setModalOpen, promptType, item } = props;
    const [editName, setEditName] = useState("");
    const { addColumn, removeColumn } = useContext(KanbanContext);
    const content =
        promptType === promptTypes.ADDING_COLUMN ? ( // TODO: validate user input
            <>
                <div style={{ paddingTop: 10 }}>Enter new column name:</div>
                <textarea
                    autoFocus
                    className="cardTextArea"
                    type="text"
                    onChange={(e) => setEditName(e.target.value)}
                    value={editName}
                />
                <button
                    className="mButton--red"
                    onClick={() => setModalOpen(false)}
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        addColumn(editName);
                        setModalOpen(false);
                    }}
                    className="mButton--green"
                >
                    Confirm
                </button>
            </>
        ) : promptType === promptTypes.DELETING_COLUMN ? (
            <>
                <div style={{ paddingTop: 10 }}>
                    Are you sure you want to delete column {item}?
                </div>
                <button
                    className="mButton--red"
                    onClick={() => setModalOpen(false)}
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        removeColumn(item);
                        setModalOpen(false);
                    }}
                    className="mButton--green"
                >
                    Confirm
                </button>
            </>
        ) : promptType === promptTypes.EDITING_COLUMN ? (
            <>
                <div style={{ paddingTop: 10 }}>Enter new column name:</div>
                <textarea
                    autoFocus
                    className="cardTextArea"
                    type="text"
                    onChange={(e) => setEditName(e.target.value)}
                    value={editName}
                />
                <button
                    className="mButton--red"
                    onClick={() => setModalOpen(false)}
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        //changeColumnTitle(editName);
                        setModalOpen(false);
                    }}
                    className="mButton--green"
                >
                    Confirm
                </button>
            </>
        ) : null;

    useEffect(() => {
        setEditName("");
    }, [promptType, modalOpen]);

    return (
        <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            contentLabel={"test"}
            className="modal"
            overlayClassName="overlay"
        >
            {content}
        </Modal>
    );
}

export default PromptModal;
