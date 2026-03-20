import type { FilterParams } from "./query";

export interface TopProductsParams {
    rank_by: "nmv" | "units_sold";
    filters: Omit<FilterParams, "from" | "to">;
}

export interface TopDataPoint {
    id: string;
    value: number;
}

export interface TopShopsParams {
    rank_by: "nmv" | "units_sold" | "product_count";
    filters: Omit<FilterParams, "from" | "to">;
}

export interface TopProductsResponse {
    products: TopDataPoint[];
}

export interface TopShopsResponse {
    shops: TopDataPoint[];
}
