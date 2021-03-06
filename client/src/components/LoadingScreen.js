import React, { useContext } from "react";
import "../styles/LoadingScreen.scss";
import KanbanContext, { LoadingType } from "./KanbanContext";

function LoadingScreen(props) {
    const { loading } = useContext(KanbanContext);
    const nothingLoading = loading === LoadingType.NONE;
    let text = "Loading board";

    return (
        <div
            style={{ display: nothingLoading ? "none" : null }}
            className="loadingScr"
        >
            {nothingLoading ? null : (
                <div className="loadingLabel">
                    <div class="lds-ellipsis">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    {text}
                </div>
            )}
        </div>
    );
}

export default LoadingScreen;
