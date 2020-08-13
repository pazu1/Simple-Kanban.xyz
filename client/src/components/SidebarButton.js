import React from "react";
import MdArrowDropdown from "react-ionicons/lib/MdArrowDropdown";

function SidebarButton(props) {
    return (
        <button className="sidebarBtn">
            <div className="sidebarBtnContainer">
                {props.icon}
                {props.title}
                {props.dropdown ? (
                    <MdArrowDropdown className="ionIcon--dropdown" />
                ) : null}
            </div>
        </button>
    );
}

export default SidebarButton;
