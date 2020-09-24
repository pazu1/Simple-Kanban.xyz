import React, { useState, useRef } from "react";
import "../styles/ContextMenu.scss";

class ContextMenu extends React.Component {
    state = {
        visible: false,
    };
    allowHideEvent = false;

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
        if (prevProps.targetRef !== this.props.targetRef)
            this.handlePosChange();
    }

    handlePosChange = () => {
        const { targetRef } = this.props;
        this.allowHideEvent = false;
        console.log(targetRef);

        this.setState({ visible: true }, () => {
            if (!targetRef) return;
            let pos = targetRef.getBoundingClientRect();
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
        if (!this.allowHideEvent) {
            this.allowHideEvent = true;
            return;
        }
        const { visible } = this.state;
        let wasOutside = false;
        if (visible) wasOutside = !this.root.contains(event.target);

        if (wasOutside && visible) {
            this.setState({ visible: false });
            return;
        }
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
    const submenuRef = useRef(null);
    const [showMenu, setShowMenu] = useState(false);
    const [smPos, setSmPos] = useState({});
    const repositionMenu = () => {
        const rect = ref.current.getBoundingClientRect();
        const titleH = rect.height;
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const menuX = rect.x;
        const menuY = rect.y;
        const menuW = submenuRef.current.offsetWidth;
        const menuH = submenuRef.current.offsetHeight;

        const right = menuX + menuW * 2 > screenW;
        const top = menuY + menuH > screenH;
        let x = rect.x + rect.width;
        let y = rect.y;
        if (right) x -= 2 * rect.width;
        if (top) y -= menuH - titleH;

        setSmPos({ x: x, y: y });
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
                <div
                    ref={submenuRef}
                    className="contextMenu--sub"
                    style={{
                        position: "fixed",
                        left: smPos.x,
                        top: smPos.y,
                        opacity: showMenu ? 1 : 0,
                    }}
                >
                    {props.children}
                </div>
            </div>
        </>
    );
}

export function MenuSeparator() {
    return <div className="contextMenu--separator" />;
}

export function MenuItem(props) {
    const { onClick } = props;
    const selected = props.selected === true || false;
    return (
        <div className="contextMenu--option" onClick={onClick}>
            {selected ? <div>✓⠀{props.children}</div> : props.children}
        </div>
    );
}

export function useHideContextmenu(ref, callback = null) {
    return () => ref.current.setState({ visible: false }, callback);
}

export function useShowContextmenu(ref, callback = null) {
    return () => {
        if (!ref || !ref.current) return;
        ref.current.handlePosChange();
        ref.current.setState({ visible: true }, callback);
    };
}

export default ContextMenu;
