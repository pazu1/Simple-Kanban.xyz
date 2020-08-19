import React, { useContext, useState } from "react";
import { ContextMenu, ContextMenuTrigger, MenuItem } from "react-contextmenu";

import "../styles/Kanban.scss";
import KColumn from "./KColumn";
import KanbanContext from "./KanbanContext";

function Kanban(props) {
    const { columns } = useContext(KanbanContext);
    const [cmCard, setCmCard] = useState(null);
    let contextTrigger = null;
    const toggleCMenu = (e, card = null) => {
        setCmCard(card);
        if (contextTrigger) {
            contextTrigger.handleContextClick(e);
        }
    };

    let columnComponents = Object.keys(columns).map((key) => {
        return <KColumn columnName={key} cmToggle={toggleCMenu} />;
    });
    return (
        <div className="kanban">
            <ContextMenuTrigger id="cardCM" ref={(c) => (contextTrigger = c)} />
            <ContextMenu id="cardCM">
                <div className="cardContextMenu">
                    <MenuItem>Edit</MenuItem>
                    <MenuItem>Delete</MenuItem>
                    <MenuItem>Archive</MenuItem>
                    <MenuItem>Priority ></MenuItem> {/*submenu*/}
                    <hr />
                    <MenuItem>Cancel</MenuItem>
                </div>
            </ContextMenu>
            <span className="projectTitle">Project Title</span>
            <div className="columnsContainer">{columnComponents}</div>
        </div>
    );
}

export default Kanban;
