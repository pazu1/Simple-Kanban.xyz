import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import MdBoard from "react-ionicons/lib/MdClipboard";
import MdTrash from "react-ionicons/lib/MdTrash";
import MdSettings from "react-ionicons/lib/MdSettings";
import MdRight from "react-ionicons/lib/MdArrowDropright";

import KanbanContext, { LoadingType } from "./KanbanContext";
import PromptModal, { promptTypes } from "./PromptModal";
import Options from "./Options";

function Index(props) {
    const { projects, loading, loadProject } = useContext(KanbanContext);
    const notReady = loading === LoadingType.PROJECTS;
    const [modalActivate, setModalActivate] = useState({
        opened: false,
        item: null,
        type: null,
    });
    const closeModal = () => {
        setModalActivate({ opened: false, item: null, type: null });
    };
    const projectComponents = projects.map((pr, index) => {
        return (
            <div className="project">
                {index === 0 ? <hr /> : null}
                <Link
                    to="/board"
                    onClick={() => {
                        loadProject(pr.id, pr.title);
                    }}
                >
                    {pr.title}
                </Link>
                <MdTrash
                    onClick={() => {
                        setModalActivate({
                            opened: true,
                            item: pr,
                            type: promptTypes.DELETING_PROJECT,
                        });
                    }}
                />
                <hr />
            </div>
        );
    });

    return (
        <>
            <PromptModal
                modalOpen={modalActivate.opened}
                closeModal={closeModal}
                promptType={modalActivate.type}
                item={modalActivate.item}
            />
            <Options setModalActivate={setModalActivate} />
            <div className="indexHeader">
                <h2>
                    {" "}
                    <MdBoard className="boardIcon" fontSize="1em" /> My boards:
                </h2>
                <div className="boardsContainer">
                    {notReady ? (
                        <p> Loading boards...</p>
                    ) : !projectComponents.length ? (
                        <p className="noBoards">No boards</p>
                    ) : (
                        projectComponents
                    )}
                    <div
                        className="projectAdd"
                        onClick={() => {
                            if (notReady) return;
                            setModalActivate({
                                opened: true,
                                item: null,
                                type: promptTypes.CREATING_PROJECT,
                            });
                        }}
                    >
                        + Create new
                    </div>
                </div>
            </div>
        </>
    );
}

export default Index;
