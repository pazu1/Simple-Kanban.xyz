import React, { useContext, useState, useRef } from "react";
import MdMore from "react-ionicons/lib/MdMore";

import "../styles/Kanban.scss";
import KColumn from "./KColumn";
import KanbanContext from "./KanbanContext";
import ContextMenu, {
    useHideContextmenu,
    useShowContextmenu,
} from "./ContextMenu";
import {
    ContextMenuProject,
    ContextMenuPriority,
    ContextMenuCard,
    ContextMenuColumn,
} from "./ContextMenuContents";

const contextMenuTypes = {
    CARD_PRIORITY: 0,
    CARD: 1,
    PROJECT: 2,
    COLUMN: 3,
};

function Kanban(props) {
    const {
        columns,
        currentProject,
        unfinishedColumns,
        cancelColumnEdit,
        finishColumnEdit,
    } = useContext(KanbanContext);
    let cmRef = useRef(null);
    let prTitleRef = useRef(null);
    const hideContextMenu = useHideContextmenu(cmRef);
    const showContextMenu = useShowContextmenu(cmRef);
    const [editColumns, setEditColumns] = useState(false);
    const [cmContent, setCmContent] = useState({
        item: null,
        targetRef: null,
        type: null,
    });
    const activateContextMenu = (ref, item, type) => {
        setCmContent({
            item: item,
            targetRef: ref,
            type: type,
        });
        showContextMenu();
    };

    let titlebarContent = (
        <div className="projectTitle">
            {currentProject ? currentProject.project_name : null}
            <button
                ref={prTitleRef}
                onClick={() => {
                    activateContextMenu(
                        prTitleRef.current,
                        null,
                        contextMenuTypes.PROJECT
                    );
                }}
                className="projectMenuBtn"
            >
                <MdMore className="projectMenuIcon" />
            </button>
        </div>
    );

    if (editColumns)
        titlebarContent = (
            <div style={{ marginBottom: 30 }}>
                <button
                    className="kButton--red"
                    onClick={() => {
                        setEditColumns(false);
                        cancelColumnEdit();
                    }}
                >
                    Cancel
                </button>
                <button
                    className="kButton--green"
                    onClick={() => {
                        setEditColumns(false);
                        finishColumnEdit();
                    }}
                >
                    Done
                </button>
                <button style={{ marginLeft: 60 }} className="kButton--green">
                    + Add column
                </button>
            </div>
        );
    let columnObjects = null;
    if (unfinishedColumns.length) columnObjects = unfinishedColumns;
    else columnObjects = columns;
    let columnComponents = columnObjects.map((col) => {
        return (
            <KColumn
                editColumns={editColumns}
                key={col.title}
                columnName={col.title}
                cmActivate={activateContextMenu}
            />
        );
    });

    return (
        <div className="kanban">
            <ContextMenu ref={cmRef} targetRef={cmContent.targetRef}>
                {cmContent.type === contextMenuTypes.CARD ? (
                    <ContextMenuCard
                        hideContextMenu={hideContextMenu}
                        card={cmContent.item}
                    />
                ) : cmContent.type === contextMenuTypes.CARD_PRIORITY ? (
                    <ContextMenuPriority card={cmContent.item} />
                ) : cmContent.type === contextMenuTypes.PROJECT ? (
                    <ContextMenuProject
                        setEditColumns={setEditColumns}
                        hideContextMenu={hideContextMenu}
                    />
                ) : cmContent.type === contextMenuTypes.COLUMN ? (
                    <ContextMenuColumn
                        column={cmContent.item}
                        hideContextMenu={hideContextMenu}
                    />
                ) : null}
            </ContextMenu>

            {titlebarContent}
            <div className="columnsContainer">{columnComponents}</div>
        </div>
    );
}

export default Kanban;
