import React from "react";

function SideBar(props) {
    return (
        <div className="sidebar">
            <button className="sidebarBtn">Add Board</button>
            <button className="sidebarBtn">My Boards</button>
            <button className="sidebarBtn">Settings</button>
        </div>
    );
}

export default SideBar;
