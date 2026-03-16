export const columns = [
    "region",
    "platform",
    "period",
    "product_id",
    "shop_id",
    "is_mall",
    "nmv",
    "units_sold",
    "avg_price_per_unit",
    "l1_category",
    "l2_category",
    "l3_category",
    "l4_category",
    "origin",
    "sku_id",
];

const requiredColumns = [
    "region",
    "platform",
    "period",
    "product_id",
    "shop_id",
];

function excelDateToDate(serial) {
    const epoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(epoch.getTime() + serial * 86400000);
}

// 1. Sanitizer: normalize "empty" values to null
function sanitize(val) {
    if (val === undefined || val === "" || val === "-") return null;
    return val;
}

// 2. Column-specific transformers
const transformers = {
    period: (val) => (typeof val === "number" ? excelDateToDate(val) : val),
    is_mall: (val) => (typeof val === "string" ? val === "Mall" : null),
    nmv: (val) => (typeof val === "number" ? val : 0),
    units_sold: (val) => (typeof val === "number" ? val : 0),
    avg_price_per_unit: (val) => (typeof val === "number" ? val : 0),
    sku_id: (val) => (typeof val === "string" ? val : null),
};

export function cleanRow(row) {
    return columns.map((col, i) => {
        let val = sanitize(row[i]);
        if (transformers[col]) val = transformers[col](val);
        return val;
    });
}

export function isValidRow(row) {
    const isValid = requiredColumns.every((col) => {
        const idx = columns.indexOf(col);
        return row[idx] != null;
    });

    return isValid;
}
