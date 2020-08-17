import React, { useContext } from "react";
import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";

import "../styles/Kanban.scss";
import KColumn from "./KColumn";
import KanbanContext from "./KanbanContext";

function Kanban(props) {
    const { columns, getCards } = useContext(KanbanContext);
    let contextTrigger = null;
    const toggleCMenu = (e) => {
        if (contextTrigger) {
            contextTrigger.handleContextClick(e);
        }
    };

    let columnComponents = Object.keys(columns).map((key) => {
        return <KColumn columnName={key} cmToggle={toggleCMenu} />;
    });
    return (
        <div className="kanban">
            <ContextMenuTrigger id="test" ref={(c) => (contextTrigger = c)} />
            <ContextMenu id="test">
                <MenuItem>Edit</MenuItem>
                <MenuItem>Delete</MenuItem>
                <MenuItem>Archive</MenuItem>
                <MenuItem>Cancel</MenuItem>
            </ContextMenu>
            <span className="projectTitle">Project Title</span>
            <div className="columnsContainer">{columnComponents}</div>
        </div>
    );
}

export default Kanban;
