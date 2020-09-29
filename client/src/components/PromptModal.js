import React, { useState, useEffect, useContext, useRef } from "react";
import Modal from "react-modal";

import "../styles/Modal.scss";
import KanbanContext from "./KanbanContext";

export const promptTypes = {
    ADDING_COLUMN: 0,
    DELETING_COLUMN: 1,
    EDITING_COLUMN: 2,
    CREATING_PROJECT: 3,
    DELETING_PROJECT: 4,
    GETTING_COOKIE: 5,
    SETTING_COOKIE: 6,
};

function PromptModal(props) {
    const { modalOpen, closeModal, promptType, item } = props;
    const textareaClippable = useRef(null);
    const [editedName, setEditedName] = useState("");
    const {
        addColumn,
        removeColumn,
        changeColumnTitle,
        addProject,
        removeProject,
    } = useContext(KanbanContext);
    const content =
        promptType === promptTypes.ADDING_COLUMN ? ( // TODO: validate user input
            <>
                <p>Enter new column name:</p>
                <textarea
                    autoFocus
                    className="cardTextArea"
                    maxLength="30"
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
                <p>
                    Are you sure you want to delete column <b>{item.title}</b>?
                    All cards inside the column will also be deleted.
                </p>
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
                <p>Enter new column name:</p>
                <textarea
                    autoFocus
                    className="cardTextArea"
                    type="text"
                    maxLength="30"
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
        ) : promptType === promptTypes.CREATING_PROJECT ? (
            <>
                <p>Enter new project name:</p>
                <textarea
                    autoFocus
                    className="cardTextArea"
                    maxLength="30"
                    type="text"
                    onChange={(e) => setEditedName(e.target.value)}
                    value={editedName}
                />
                <button className="mButton--red" onClick={() => closeModal()}>
                    Cancel
                </button>
                <button
                    onClick={() => {
                        addProject(editedName);
                        closeModal();
                    }}
                    className="mButton--green"
                >
                    Confirm
                </button>
            </>
        ) : promptType === promptTypes.DELETING_PROJECT ? (
            <>
                <p>
                    Are you sure you want to permanently delete project{" "}
                    <b>{item.title}</b>?
                </p>
                <button className="mButton--red" onClick={() => closeModal()}>
                    Cancel
                </button>
                <button
                    onClick={() => {
                        removeProject(item.id);
                        closeModal();
                    }}
                    className="mButton--green"
                >
                    Confirm
                </button>
            </>
        ) : promptType === promptTypes.GETTING_COOKIE ? (
            <>
                <p>
                    Here is your access information. You can copy this text and
                    import it in another browser session to get access to your
                    boards.
                </p>
                <textarea
                    ref={textareaClippable}
                    autoFocus
                    className="cookieTextArea"
                    readOnly
                    value={item}
                />
                <button
                    onClick={() => {
                        textareaClippable.current.select();
                        document.execCommand("copy");
                        closeModal();
                    }}
                    className="mButton--green"
                >
                    Copy to clipboard
                </button>
                <button
                    onClick={() => {
                        closeModal();
                    }}
                    className="mButton--red"
                >
                    Cancel
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
