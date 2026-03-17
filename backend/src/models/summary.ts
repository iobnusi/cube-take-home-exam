import type { FilterParams } from "./query";

export type SummaryMetric =
    | "nmv"
    | "units_sold"
    | "avg_price"
    | "unique_products"
    | "unique_shops";

export type SummaryGroupBy =
    | "platform"
    | "region"
    | "is_mall"
    | "origin"
    | "l1_category"
    | "l2_category"
    | "l3_category"
    | "l4_category";

export interface SummaryParams {
    group_by?: SummaryGroupBy;
    filters: FilterParams;
}

export interface SummaryResponse {
    metric: SummaryMetric;
    total: number;
    breakdown?: {
        group_by: SummaryGroupBy;
        items: SummaryBreakdownItem[];
    };
}

interface SummaryBreakdownItem {
    group: string; // the dimension value, e.g. "Shopee", "PH", "Oral Care"
    value: number;
}
