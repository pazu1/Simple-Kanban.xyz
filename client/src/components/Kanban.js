import React, { useContext, useState } from "react";

import "../styles/Kanban.scss";
import KColumn from "./KColumn";
import KanbanContext from "./KanbanContext";
import ContextMenu, { MenuItem, SubMenu, MenuSeparator } from "./ContextMenu";

function Kanban(props) {
    const { columns } = useContext(KanbanContext);
    const [cmContent, setCmContent] = useState({
        card: null,
        pos: null,
    });
    const toggleContextMenu = (pos, card) => {
        setCmContent({
            card: card,
            pos: pos,
        });
    };
    let columnComponents = Object.keys(columns).map((key) => {
        return <KColumn columnName={key} cmToggle={toggleContextMenu} />;
    });
    const { card } = cmContent;
    let cardPriority = false;
    if (card) cardPriority = card.priority;

    return (
        <div className="kanban">
            <ContextMenu pos={cmContent.pos} visible={cmContent.show}>
                <MenuItem>Edit</MenuItem>
                <MenuItem>Delete</MenuItem>
                <SubMenu title="Priority">
                    <MenuItem selected={cardPriority === 1}>Low</MenuItem>
                    <MenuItem selected={cardPriority === 2}>Medium</MenuItem>
                    <MenuItem selected={cardPriority === 3}>High</MenuItem>
                </SubMenu>
                <MenuSeparator />
                <MenuItem>Cancel</MenuItem>
            </ContextMenu>

            <span className="projectTitle">Project Title</span>
            <div className="columnsContainer">{columnComponents}</div>
        </div>
    );
}

export default Kanban;
