import React, { useState, useContext } from "react";
import MdSettings from "react-ionicons/lib/MdSettings";
import MdArrowDropdown from "react-ionicons/lib/MdArrowDropdown";
import MdArrowDropup from "react-ionicons/lib/MdArrowDropup";
import MdCodeDownload from "react-ionicons/lib/MdCodeDownload";
import { promptTypes } from "./PromptModal";
import KanbanContext from "./KanbanContext";

import LogoGithub from "react-ionicons/lib/LogoGithub";

function Options(props) {
    const [visible, setVisible] = useState(false);
    const { getAccessData } = useContext(KanbanContext);
    return (
        <div className="optionsContainer">
            <button onClick={() => setVisible(!visible)} className="togglebtn">
                <MdSettings />
                {visible ? <MdArrowDropup /> : <MdArrowDropdown />}
            </button>
            <div
                style={{ display: !visible ? "none" : null }}
                className="optionsContent"
            >
                <button
                    onClick={async () => {
                        const data = await getAccessData();
                        props.setModalActivate({
                            opened: true,
                            item: data,
                            type: promptTypes.GETTING_COOKIE,
                        });
                    }}
                >
                    Export access data <MdCodeDownload className="bIco" />
                </button>
                <button>
                    Import access data{" "}
                    <MdCodeDownload
                        style={{ transform: "scale(1,-1)" }}
                        className="bIco"
                    />
                </button>
                <button>
                    View on GitHub <LogoGithub className="bIco" />
                </button>
            </div>
        </div>
    );
}

export default Options;
