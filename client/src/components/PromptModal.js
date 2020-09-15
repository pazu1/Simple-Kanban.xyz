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
    const { modalOpen, closeModal, promptType, item } = props;
    const [editedName, setEditedName] = useState("");
    const { addColumn, removeColumn, changeColumnTitle } = useContext(
        KanbanContext
    );
    const content =
        promptType === promptTypes.ADDING_COLUMN ? ( // TODO: validate user input
            <>
                <div style={{ paddingTop: 10 }}>Enter new column name:</div>
                <textarea
                    autoFocus
                    className="cardTextArea"
                    type="text"
                    onChange={(e) => setEditedName(e.target.value)}
                    value={editedName}
                />
                <div>
                    <input
                        type="checkbox"
                        id="doneCol"
                        name="doneCol"
                        value="checked"
                    />
                    <label for="doneCol">
                        Mark cards in this column as done
                    </label>
                </div>
                <button className="mButton--red" onClick={() => closeModal()}>
                    Cancel
                </button>
                <button
                    onClick={() => {
                        addColumn(editedName);
                        closeModal();
                    }}
                    className="mButton--green"
                >
                    Confirm
                </button>
            </>
        ) : promptType === promptTypes.DELETING_COLUMN ? (
            <>
                <div style={{ paddingTop: 10 }}>
                    Are you sure you want to delete column <b>{item.title}</b>?
                    All cards inside the column will also be deleted.
                </div>
                <button className="mButton--red" onClick={() => closeModal()}>
                    Cancel
                </button>
                <button
                    onClick={() => {
                        removeColumn(item.id);
                        closeModal();
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
                    onChange={(e) => setEditedName(e.target.value)}
                    value={editedName}
                />
                <button className="mButton--red" onClick={() => closeModal()}>
                    Cancel
                </button>
                <button
                    onClick={() => {
                        changeColumnTitle(item.id, editedName);
                        closeModal();
                    }}
                    className="mButton--green"
                >
                    Confirm
                </button>
            </>
        ) : null;

    useEffect(() => {
        setEditedName("");
    }, [promptType, modalOpen]);

    return (
        <Modal
            isOpen={modalOpen}
            onRequestClose={() => closeModal()}
            contentLabel={"test"}
            className="modal"
            overlayClassName="overlay"
        >
            {content}
        </Modal>
    );
}

export default PromptModal;
