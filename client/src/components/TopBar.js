import React, { useContext } from "react";
import MdSync from "react-ionicons/lib/MdSync";
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
