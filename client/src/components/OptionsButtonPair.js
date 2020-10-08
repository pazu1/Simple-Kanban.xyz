import React from "react";
import "../styles/Index.scss";
import "../styles/Modal.scss";

function OptionsButtonPair(props) {
    const { onClose, onConfirm, confirmTxt, closeTxt } = props;
    return (
        <div className="optionsButtonPair">
            <button className="mButton--red" onClick={onClose}>
                {closeTxt ? closeTxt : "Cancel"}
            </button>
            <button className="mButton--green" onClick={onConfirm}>
                {confirmTxt ? confirmTxt : "Confirm"}
            </button>
        </div>
    );
}

export default OptionsButtonPair;
