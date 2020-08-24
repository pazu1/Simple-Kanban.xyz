import React, { useContext, useState, useRef } from "react";
import MdMore from "react-ionicons/lib/MdMore";

import "../styles/Kanban.scss";
import KColumn from "./KColumn";
import KanbanContext from "./KanbanContext";
import ContextMenu, {
    MenuItem,
    SubMenu,
    MenuSeparator,
    useHideContextmenu,
    useShowContextmenu,
} from "./ContextMenu";

const contextMenuTypes = {
    CARD_PRIORITY: 0,
    CARD: 1,
    PROJECT: 2,
};

function Kanban(props) {
    const {
        columns,
        makeCardEditable,
        updateCardPriority,
        removeCard,
    } = useContext(KanbanContext);
    let cmRef = useRef(null);
    let prTitleRef = useRef(null);
    const hideContextMenu = useHideContextmenu(cmRef);
    const showContextMenu = useShowContextmenu(cmRef);
    const [cmContent, setCmContent] = useState({
        card: null,
        targetRef: null,
        type: null,
    });
    const toggleContextMenu = (ref, card, onlyPriority = false) => {
        let type = contextMenuTypes.CARD;
        if (onlyPriority) type = contextMenuTypes.CARD_PRIORITY;
        setCmContent({
            card: card,
            targetRef: ref,
            type: type,
        });
        showContextMenu();
    };
    const { card } = cmContent;
    let cardPriority = false;
    if (card) cardPriority = card.priority;
    const contextMenuProject = (
        <>
            <MenuItem>Edit title</MenuItem>
            <MenuItem>Edit columns</MenuItem>
            <MenuSeparator />
            <MenuItem onClick={hideContextMenu}>Cancel</MenuItem>
        </>
    );
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
    const contextMenuCard = (
        <>
            <MenuItem
                onClick={() => {
                    makeCardEditable(card);
                    hideContextMenu();
                }}
            >
                Edit label
            </MenuItem>
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
        return (
            <KColumn key={key} columnName={key} cmToggle={toggleContextMenu} />
        );
    });

    return (
        <div className="kanban">
            <ContextMenu ref={cmRef} targetRef={cmContent.targetRef}>
                {cmContent.type === contextMenuTypes.CARD
                    ? contextMenuCard
                    : contextMenuPriority}
            </ContextMenu>

            <div className="projectTitle">
                Project Title
                <button
                    ref={prTitleRef}
                    onClick={() => {
                        setCmContent({
                            card: null,
                            targetRef: prTitleRef.current,
                            type: contextMenuTypes.PROJECT,
                        });
                        showContextMenu();
                    }}
                    className="projectMenuBtn"
                >
                    <MdMore className="projectMenuIcon" />
                </button>
            </div>
            <div className="columnsContainer">{columnComponents}</div>
        </div>
    );
}

export default Kanban;
