import React, { useContext, useState } from "react";

import "../styles/Kanban.scss";
import KColumn from "./KColumn";
import KanbanContext from "./KanbanContext";
import ContextMenu from "./ContextMenu";

function Kanban(props) {
    const { columns } = useContext(KanbanContext);
    const [cmCard, setCmCard] = useState(null);
    const [showCM, setShowCM] = useState(false);
    const [cmPos, setCmPos] = useState(null);
    const toggleContextMenu = (pos, enable) => {
        setShowCM(enable);
        setCmPos(pos);
    };
    let columnComponents = Object.keys(columns).map((key) => {
        return <KColumn columnName={key} cmToggle={toggleContextMenu} />;
    });
    return (
        <div className="kanban">
            <ContextMenu
                pos={cmPos}
                visible={showCM}
                toggleVisible={setShowCM}
            ></ContextMenu>
            <span className="projectTitle">Project Title</span>
            <div className="columnsContainer">{columnComponents}</div>
        </div>
    );
}

export default Kanban;
