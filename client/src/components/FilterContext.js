import React, { useState, createContext } from "react";

const FilterContext = createContext();

function FilterContextProvider(props) {
    const [filter, setFilter] = useState("");

    return (
        <FilterContext.Provider
            value={{
                filter,
                setFilter,
            }}
        >
            {props.children}
        </FilterContext.Provider>
    );
}

export default FilterContext;
export { FilterContextProvider };
