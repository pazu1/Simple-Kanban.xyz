import React, { useContext } from "react";
import MdSync from "react-ionicons/lib/MdSync";
import "../styles/Topbar.scss";

import KanbanContext from "./KanbanContext";

function TopBar(props) {
    const { synchronizing } = useContext(KanbanContext);

    return (
        <div className="topbar">
            {synchronizing ? (
                <div>
                    <MdSync className="syncIcon" />
                </div>
            ) : null}
        </div>
    );
}

export default TopBar;
