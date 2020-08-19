import React from "react";
import "../styles/ContextMenu.scss";

class ContextMenu extends React.Component {
    componentDidMount() {
        document.addEventListener("click", this._handleClick);
        document.addEventListener("scroll", this._handleScroll);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this._handleClick);
        document.removeEventListener("scroll", this._handleScroll);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.pos != this.props.pos) this.handlePosChange();
    }

    handlePosChange = () => {
        const { pos } = this.props;

        this.props.toggleVisible(true);
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
            this.root.style.left = `${clickX + 5}px`;
        }

        if (left) {
            this.root.style.left = `${clickX - rootW - 5}px`;
        }

        if (top) {
            this.root.style.top = `${clickY + 5}px`;
        }

        if (bottom) {
            this.root.style.top = `${clickY - rootH - 5}px`;
        }
    };

    _handleClick = (event) => {
        const { visible, toggleVisible } = this.props;
        const wasOutside = !(event.target.contains === this.root);

        if (wasOutside && visible) toggleVisible(false);
    };

    _handleScroll = () => {
        const { visible, toggleVisible } = this.props;

        if (visible) toggleVisible(false);
    };

    render() {
        const { visible } = this.props;

        return (
            (visible || null) && (
                <div
                    ref={(ref) => {
                        this.root = ref;
                    }}
                    className="contextMenu"
                >
                    <div className="contextMenu--option">Edit</div>
                    <div className="contextMenu--option">Delete</div>
                    <div className="contextMenu--option">Priority -></div>
                    <div className="contextMenu--option contextMenu--option__disabled">
                        Archive
                    </div>
                    <div className="contextMenu--separator" />
                    <div className="contextMenu--option">Cancel</div>
                </div>
            )
        );
    }
}

export default ContextMenu;
