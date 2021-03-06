import React, { useContext } from "react";
import KanbanContext from "./KanbanContext";
import { MenuItem, SubMenu, MenuSeparator } from "./ContextMenu";
import { promptTypes } from "./PromptModal";

const ContextMenuProject = ({ setEditColumns, hideContextMenu }) => {
    return (
        <>
            <MenuItem
                onClick={() => {
                    setEditColumns(true);
                    hideContextMenu();
                }}
            >
                Move columns
            </MenuItem>
            <MenuSeparator />
            <MenuItem onClick={hideContextMenu}>Cancel</MenuItem>
        </>
    );
};
const ContextMenuPriority = ({ card }) => {
    const { updateCardPriority } = useContext(KanbanContext);
    let cardPriority = card.priority;
    return (
        <>
            <MenuItem
                onClick={() => updateCardPriority(1, card)}
                selected={cardPriority === 1}
            >
                Low
            </MenuItem>
            <MenuItem
                onClick={() => updateCardPriority(2, card)}
                selected={cardPriority === 2}
            >
                Medium
            </MenuItem>
            <MenuItem
                onClick={() => updateCardPriority(3, card)}
                selected={cardPriority === 3}
            >
                High
            </MenuItem>
        </>
    );
};
const ContextMenuCard = ({ card, hideContextMenu }) => {
    const { makeCardEditable, removeCard } = useContext(KanbanContext);
    return (
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
            <SubMenu title="Priority">
                <ContextMenuPriority card={card} />
            </SubMenu>
            <MenuSeparator />
            <MenuItem onClick={hideContextMenu}>Cancel</MenuItem>
        </>
    );
};

const ContextMenuColumn = ({ hideContextMenu, column, setModalActivate }) => {
    return (
        <>
            <MenuItem
                onClick={() => {
                    setModalActivate({
                        opened: true,
                        item: column,
                        type: promptTypes.EDITING_COLUMN,
                    });
                    hideContextMenu();
                }}
            >
                Edit column title
            </MenuItem>
            <MenuItem
                onClick={() => {
                    setModalActivate({
                        opened: true,
                        item: column,
                        type: promptTypes.DELETING_COLUMN,
                    });
                    hideContextMenu();
                }}
            >
                Delete column
            </MenuItem>
            <MenuSeparator />
            <MenuItem onClick={hideContextMenu}>Cancel</MenuItem>
        </>
    );
};

export {
    ContextMenuPriority,
    ContextMenuCard,
    ContextMenuColumn,
    ContextMenuProject,
};
