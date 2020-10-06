import React, { useState, useContext } from "react";
import MdMenu from "react-ionicons/lib/MdMenu";
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
                <MdMenu />
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
                <button
                    onClick={() => {
                        props.setModalActivate({
                            opened: true,
                            item: null,
                            type: promptTypes.SETTING_COOKIE,
                        });
                    }}
                >
                    Import access data{" "}
                    <MdCodeDownload
                        style={{ transform: "scale(1,-1)" }}
                        className="bIco"
                    />
                </button>
                <a
                    href="https://github.com/pazu1/Kanban-Board"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <button>
                        View on GitHub <LogoGithub className="bIco" />
                    </button>
                </a>
            </div>
        </div>
    );
}

export default Options;
