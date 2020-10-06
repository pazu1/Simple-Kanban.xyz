import React, { useState, useEffect, useContext, useRef } from "react";
import Modal from "react-modal";
import OptionsButtonPair from "./OptionsButtonPair";

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
    const [editedText, setEditedText] = useState("");
    const {
        addColumn,
        removeColumn,
        changeColumnTitle,
        addProject,
        removeProject,
        setAccessData,
    } = useContext(KanbanContext);
    const content =
        promptType === promptTypes.ADDING_COLUMN ? (
            <>
                <p>Enter new column name:</p>
                <textarea
                    autoFocus
                    className="cardTextArea"
                    maxLength="30"
                    type="text"
                    onChange={(e) => setEditedText(e.target.value)}
                    value={editedText}
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
                <OptionsButtonPair
                    onClose={() => closeModal()}
                    onConfirm={() => {
                        addColumn(editedText);
                        closeModal();
                    }}
                />
            </>
        ) : promptType === promptTypes.DELETING_COLUMN ? (
            <>
                <p>
                    Are you sure you want to delete column <b>{item.title}</b>?
                    All cards inside the column will also be deleted.
                </p>
                <OptionsButtonPair
                    onClose={() => closeModal()}
                    onConfirm={() => {
                        removeColumn(item.id);
                        closeModal();
                    }}
                />
            </>
        ) : promptType === promptTypes.EDITING_COLUMN ? (
            <>
                <p>Enter new column name:</p>
                <textarea
                    autoFocus
                    className="cardTextArea"
                    type="text"
                    maxLength="30"
                    onChange={(e) => setEditedText(e.target.value)}
                    value={editedText}
                />
                <OptionsButtonPair
                    onClose={() => closeModal()}
                    onConfirm={() => {
                        changeColumnTitle(item.id, editedText);
                        closeModal();
                    }}
                />
            </>
        ) : promptType === promptTypes.CREATING_PROJECT ? (
            <>
                <p>Enter new project name:</p>
                <textarea
                    autoFocus
                    className="cardTextArea"
                    maxLength="30"
                    type="text"
                    onChange={(e) => setEditedText(e.target.value)}
                    value={editedText}
                />
                <OptionsButtonPair
                    onClose={() => closeModal()}
                    onConfirm={() => {
                        addProject(editedText);
                        closeModal();
                    }}
                />
            </>
        ) : promptType === promptTypes.DELETING_PROJECT ? (
            <>
                <p>
                    Are you sure you want to permanently delete project{" "}
                    <b>{item.title}</b>?
                </p>
                <OptionsButtonPair
                    onClose={() => closeModal()}
                    onConfirm={() => {
                        removeProject(item.id);
                        closeModal();
                    }}
                />
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
                <OptionsButtonPair
                    onClose={() => closeModal()}
                    confirmTxt="Copy to clipboard"
                    onConfirm={() => {
                        textareaClippable.current.select();
                        document.execCommand("copy");
                        closeModal();
                    }}
                />
            </>
        ) : promptType === promptTypes.SETTING_COOKIE ? (
            <>
                <p>
                    Paste your access information here.
                    <br />
                    <strong>
                        Beware, data in your current browser session will be
                        lost.
                    </strong>
                </p>
                <textarea
                    autoFocus
                    className="cookieTextArea"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                />
                <OptionsButtonPair
                    onClose={() => closeModal()}
                    confirmTxt="Continue"
                    onConfirm={() => {
                        setAccessData(editedText);
                        closeModal();
                    }}
                />
            </>
        ) : null;

    useEffect(() => {
        setEditedText("");
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
