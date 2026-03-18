import type { FilterParams } from "./query";

export type TrendGroupBy = "platform" | "region";

export interface TrendParams {
    group_by?: TrendGroupBy;
    filters: FilterParams;
}

export interface TrendDataPoint {
    period: string;
    group?: string;
    nmv: number;
    units_sold: number;
    avg_price_per_unit: number;
    nmv_per_shop: number;
    active_products: number;
    active_shops: number;
}

export interface TrendResponse {
    data: Record<string, TrendDataPoint[]>;
}
