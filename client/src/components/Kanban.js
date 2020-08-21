import React, { useContext, useState, useRef } from "react";

import "../styles/Kanban.scss";
import KColumn from "./KColumn";
import KanbanContext from "./KanbanContext";
import ContextMenu, { MenuItem, SubMenu, MenuSeparator } from "./ContextMenu";

function Kanban(props) {
    const { columns, updateCardPriority, removeCard } = useContext(
        KanbanContext
    );
    let cmRef = useRef(null);
    const [cmContent, setCmContent] = useState({
        card: null,
        pos: null,
        onlyPriority: false,
    });
    const toggleContextMenu = (pos, card, onlyPriority = false) => {
        setCmContent({
            card: card,
            pos: pos,
            onlyPriority: onlyPriority,
        });
    };
    const { card } = cmContent;
    let cardPriority = false;
    if (card) cardPriority = card.priority;
    const hideContextMenu = () => {
        cmRef.current.setState({ visible: false });
    };
    const contextMenuPriority = (
        <>
            <MenuItem
                onClick={() => updateCardPriority(1, cmContent.card)}
                selected={cardPriority === 1}
            >
                Low
            </MenuItem>
            <MenuItem
                onClick={() => updateCardPriority(2, cmContent.card)}
                selected={cardPriority === 2}
            >
                Medium
            </MenuItem>
            <MenuItem
                onClick={() => updateCardPriority(3, cmContent.card)}
                selected={cardPriority === 3}
            >
                High
            </MenuItem>
        </>
    );
    const contextMenuMain = (
        <>
            <MenuItem>Edit label</MenuItem>
            <MenuItem
                onClick={() => {
                    removeCard(card);
                    hideContextMenu();
                }}
            >
                Delete
            </MenuItem>
            <SubMenu title="Priority">{contextMenuPriority}</SubMenu>
            <MenuSeparator />
            <MenuItem onClick={hideContextMenu}>Cancel</MenuItem>
        </>
    );

    let columnComponents = Object.keys(columns).map((key) => {
        return <KColumn columnName={key} cmToggle={toggleContextMenu} />;
    });

    return (
        <div className="kanban">
            <ContextMenu ref={cmRef} pos={cmContent.pos}>
                {cmContent.onlyPriority ? contextMenuPriority : contextMenuMain}
            </ContextMenu>

            <span className="projectTitle">Project Title</span>
            <div className="columnsContainer">{columnComponents}</div>
        </div>
    );
}

export default Kanban;
