import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";

import "../styles/Modal.scss";
import KanbanContext from "./KanbanContext";

export const promptTypes = {
    ADDING_COLUMN: 0,
    DELETING_COLUMN: 1,
    CREATING_PROJECT: 2,
};

function PromptModal(props) {
    const { modalOpen, setModalOpen, promptType } = props;
    const [editName, setEditName] = useState("");
    const { addColumn } = useContext(KanbanContext);
    const content =
        promptType === promptTypes.ADDING_COLUMN ? (
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
            <div>Are you sure you want to delete this column?</div>
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
