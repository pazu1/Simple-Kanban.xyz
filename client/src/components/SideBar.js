import React, { useState } from "react";
import MdTime from "react-ionicons/lib/MdTime";

import SidebarButton from "./SidebarButton";
import "../styles/Sidebar.scss";

function SideBar(props) {
    const [index, setIndex] = useState(0);
    return (
        <div className="sidebar">
            <SidebarButton
                icon={<MdTime className="ionIcon" fontSize={16} />}
                title="Recent"
                dropdown={true}
            />
            <SidebarButton title="My Boards" dropdown={true} />
            <SidebarButton title="Bookmarks" />
            <SidebarButton title="Settings" />
        </div>
    );
}

export default SideBar;
