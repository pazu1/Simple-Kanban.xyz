import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MdSync from "react-ionicons/lib/MdSync";
import MdBack from "react-ionicons/lib/MdArrowRoundBack";
import MdHome from "react-ionicons/lib/MdHome";
import "../styles/Topbar.scss";

import KanbanContext from "./KanbanContext";
import SettingsContext from "./SettingsContext";

function TopBar(props) {
    const { synchronizing } = useContext(KanbanContext);
    const {
        hidePriorityLabels,
        togglePriorityLabels,
        filter,
        setFilter,
    } = useContext(SettingsContext);
    console.log(hidePriorityLabels);

    const handleInputChange = (event) => {
        setFilter(event.target.value);
    };

    return (
        <div className="topbar">
            <Link to="/" className="backBtnContainer">
                <MdHome />
                <MdBack />
            </Link>
            <div className="topBarContent">
                <input
                    className="searchBar"
                    type="text"
                    name="filter"
                    placeholder="Filter by"
                    value={filter}
                    onChange={handleInputChange}
                />
                <div>
                    <input
                        type="checkbox"
                        name="hidePrority"
                        id="hidePrority"
                        checked={hidePriorityLabels}
                        onChange={togglePriorityLabels}
                    />
                    <label for="hidePrority">Hide priority labels</label>
                </div>
                {synchronizing ? (
                    <div className="syncContainer">
                        <MdSync className="syncIcon" />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default TopBar;
