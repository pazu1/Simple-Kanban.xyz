import React, { useState, useRef } from "react";
import "../styles/ContextMenu.scss";

class ContextMenu extends React.Component {
    state = {
        visible: false,
    };

    componentDidMount() {
        document.addEventListener("click", this.handleClick);
        document.addEventListener("scroll", this.handleScroll);
        document.addEventListener("drag", this.handleScroll);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClick);
        document.removeEventListener("scroll", this.handleScroll);
        document.removeEventListener("drag", this.handleScroll);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.pos != this.props.pos) this.handlePosChange();
    }

    handlePosChange = () => {
        const { pos } = this.props;

        this.setState({ visible: true }, () => {
            if (!pos) return;
            const clickX = pos.x + pos.width;
            const clickY = pos.y;
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;
            const rootW = this.root.offsetWidth;
            const rootH = this.root.offsetHeight;

            const right = screenW - clickX > rootW;
            const left = !right;
            const top = screenH - clickY > rootH;
            const bottom = !top;

            if (right) {
                this.root.style.left = `${clickX}px`;
            }

            if (left) {
                this.root.style.left = `${clickX - rootW}px`;
            }

            if (top) {
                this.root.style.top = `${clickY}px`;
            }

            if (bottom) {
                this.root.style.top = `${clickY - rootH}px`;
            }
        });
    };

    handleClick = (event) => {
        const { visible } = this.state;
        const wasOutside = !(event.target.contains === this.root);

        if (wasOutside && visible) this.setState({ visible: false });
    };

    handleScroll = () => {
        const { visible } = this.state;

        if (visible) this.setState({ visible: false });
    };

    render() {
        const { visible } = this.state;

        return (
            (visible || null) && (
                <div
                    ref={(ref) => {
                        this.root = ref;
                    }}
                    className="contextMenu"
                >
                    {this.props.children}
                </div>
            )
        );
    }
}

export function SubMenu(props) {
    const ref = useRef(null);
    const [showMenu, setShowMenu] = useState(false);
    const [smPos, setSmPos] = useState({ x: 100, y: 100 });
    const repositionMenu = () => {
        const rect = ref.current.getBoundingClientRect();
        console.log(rect);
        setSmPos({ x: rect.x + rect.width, y: rect.y });
    };

    const { title } = props;
    return (
        <>
            <div
                ref={ref}
                className="contextMenu--option"
                onMouseEnter={() => {
                    repositionMenu();
                    setShowMenu(true);
                }}
                onMouseLeave={() => setShowMenu(false)}
            >
                {title}
                <span>></span>
                {showMenu ? (
                    <div
                        className="contextMenu--sub"
                        style={{
                            position: "fixed",
                            left: smPos.x,
                            top: smPos.y,
                        }}
                    >
                        {
                            props.children /* These float on the outside of the div*/
                        }
                    </div>
                ) : null}
            </div>
        </>
    );
}

export function MenuSeparator() {
    return <div className="contextMenu--separator" />;
}

export function MenuItem(props) {
    return <div className="contextMenu--option">{props.children}</div>;
}

export default ContextMenu;
