import React from "react";
import { Link } from "react-router-dom";

function Index(props) {
    return (
        <div className="indexHeader">
            My projects:
            <li>
                <Link to="/board">Go to board</Link>
            </li>
        </div>
    );
}

export default Index;
