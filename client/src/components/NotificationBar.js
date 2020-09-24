import React, { useContext } from "react";
import KanbanContext from "./KanbanContext";
import "../styles/NotificationBar.scss";

function NotificationBar() {
    const { error } = useContext(KanbanContext);

    return (
        <div>
            {error === 500 ? (
                <div className="notificationBar">
                    Internal Server Error. Couldn't connect to server.
                </div>
            ) : null}
        </div>
    );
}

export default NotificationBar;
