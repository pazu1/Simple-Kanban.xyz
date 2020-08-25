export const ItemTypes = {
    CARD: "card",
    COLUMN: "column",
};

export function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

export const PriorityLevels = {
    1: "Low",
    2: "Medium",
    3: "High",
};
