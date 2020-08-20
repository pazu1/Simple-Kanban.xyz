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
    return (
        <div className="kanban">
            <ContextMenu pos={cmContent.pos} visible={cmContent.show}>
                <MenuItem>Edit</MenuItem>
                <MenuItem>Delete</MenuItem>
                <SubMenu title="Priority">
                    <MenuItem>Low</MenuItem>
                    <MenuItem>Medium</MenuItem>
                    <MenuItem>High</MenuItem>
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
