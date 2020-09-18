import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import MdBoard from "react-ionicons/lib/MdClipboard";
import MdTrash from "react-ionicons/lib/MdTrash";

import KanbanContext from "./KanbanContext";
import PromptModal, { promptTypes } from "./PromptModal";

function Index(props) {
    const { projects, loadProject } = useContext(KanbanContext);
    const [modalActivate, setModalActivate] = useState({
        opened: false,
        item: null,
        type: null,
    });
    const closeModal = () => {
        setModalActivate({ opened: false, item: null, type: null });
    };
    console.log(projects);

    return (
        <>
            <PromptModal
                modalOpen={modalActivate.opened}
                closeModal={closeModal}
                promptType={modalActivate.type}
                item={modalActivate.item}
            />
            <div className="indexHeader">
                <h2>
                    {" "}
                    <MdBoard className="boardIcon" fontSize="1em" /> My boards:
                </h2>
                <div className="boardsContainer">
                    {projects.map((pr, index) => {
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
                    })}
                    <div
                        className="projectAdd"
                        onClick={() =>
                            setModalActivate({
                                opened: true,
                                item: null,
                                type: promptTypes.CREATING_PROJECT,
                            })
                        }
                    >
                        + Create new
                    </div>
                </div>
            </div>
        </>
    );
}

export default Index;
