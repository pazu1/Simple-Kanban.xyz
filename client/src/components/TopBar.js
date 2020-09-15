import React, { useContext } from "react";
import { Link } from "react-router-dom";
import MdSync from "react-ionicons/lib/MdSync";
import MdBack from "react-ionicons/lib/MdArrowRoundBack";
import MdHome from "react-ionicons/lib/MdHome";
import "../styles/Topbar.scss";

import KanbanContext from "./KanbanContext";
import FilterContext from "./FilterContext";

function TopBar(props) {
    const { synchronizing } = useContext(KanbanContext);
    const { filter, setFilter } = useContext(FilterContext);

    const handleInputChange = (event) => {
        setFilter(event.target.value);
    };

    return (
        <div className="topbar">
            <Link to="/" className="backBtnContainer">
                <MdHome />
                <MdBack />
            </Link>
            <input
                className="searchBar"
                type="text"
                name="filter"
                placeholder="Filter by"
                value={filter}
                onChange={handleInputChange}
            />
            {synchronizing ? (
                <div className="syncContainer">
                    <MdSync className="syncIcon" />
                </div>
            ) : null}
        </div>
    );
}

export default TopBar;
