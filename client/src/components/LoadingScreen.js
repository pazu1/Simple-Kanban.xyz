import React from "react";
import "../styles/LoadingScreen.scss";

function LoadingScreen(props) {
    return (
        <div className="loadingScr">
            <span>
                Loading board
                <div class="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </span>
        </div>
    );
}

export default LoadingScreen;
