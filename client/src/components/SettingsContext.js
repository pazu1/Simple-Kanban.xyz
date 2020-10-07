import React, { createContext } from "react";
const SettingsContext = createContext();

class SettingsContextProvider extends React.Component {
    constructor() {
        super();
        this.state = {
            hidePriorityLabels: JSON.parse(
                localStorage.getItem("hidePriorityLabels")
            ),
            filter: "",
        };
        this.togglePriorityLabels = this.togglePriorityLabels.bind(this);
        this.setFilter = this.setFilter.bind(this);
    }

    setFilter(val) {
        this.setState({ filter: val });
    }

    togglePriorityLabels() {
        this.setState((prevState) => {
            localStorage.setItem(
                "hidePriorityLabels",
                !prevState.hidePriorityLabels
            );
            return { hidePriorityLabels: !prevState.hidePriorityLabels };
        });
    }

    render() {
        const { hidePriorityLabels, filter } = this.state;
        const { togglePriorityLabels, setFilter } = this;

        return (
            <SettingsContext.Provider
                value={{
                    hidePriorityLabels,
                    togglePriorityLabels,
                    filter,
                    setFilter,
                }}
            >
                {this.props.children}
            </SettingsContext.Provider>
        );
    }
}

export default SettingsContext;

export { SettingsContextProvider };
