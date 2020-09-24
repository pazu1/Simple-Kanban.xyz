import React, { useContext } from "react";
import "../styles/LoadingScreen.scss";
import KanbanContext, { LoadingType } from "./KanbanContext";

function LoadingScreen(props) {
    const { loading } = useContext(KanbanContext);
    const nothingLoading = loading == LoadingType.NONE;
    let text = "Loading boards";
    if (loading == LoadingType.CARD) text = "Loading board";

    return (
        <div
            style={{ display: nothingLoading ? "none" : null }}
            className="loadingScr"
        >
            {nothingLoading ? null : (
                <div>
                    {text}
                    <div class="lds-ellipsis">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoadingScreen;
