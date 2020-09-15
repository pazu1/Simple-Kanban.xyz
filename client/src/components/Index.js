import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import MdBoard from "react-ionicons/lib/MdClipboard";
import MdTrash from "react-ionicons/lib/MdTrash";

import KanbanContext from "./KanbanContext";

function Index(props) {
    const { projects, loadProject } = useContext(KanbanContext);

    console.log(projects);
    return (
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
                            <MdTrash />
                            <hr />
                        </div>
                    );
                })}
                <div className="project">+ Create new</div>
            </div>
        </div>
    );
}

export default Index;
