export const ItemTypes = {
    CARD: "card",
    COLUMN: "column",
};

export function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

export function normalizeIndices(arr) {
    arr.forEach((x, index) => {
        x.index = index;
    });
}

export function sortByIndex(ca, cb) {
    let a = ca.index;
    let b = cb.index;
    return a < b ? -1 : a > b ? 1 : 0;
}

// Make first index is 0.
// Make the variance of each index to it's neighbors is 1.
export function sortAndNormalizeIndices(arr) {
    arr.sort(sortByIndex);
    arr.forEach((x, index) => {
        x.index = index;
    });
    return arr;
}

export const PriorityLevels = {
    1: "Low",
    2: "Medium",
    3: "High",
};
