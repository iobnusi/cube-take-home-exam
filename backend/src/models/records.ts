import type { FilterParams, PaginatedResponse } from "./query";

export interface Record {
    id: number;
    created_at: string;
    period: string;
    region: string;
    platform: string;
    shop_id: string;
    product_id: string;
    sku_id: string | null;
    is_mall: boolean | null;
    l1_category: string;
    l2_category: string;
    l3_category: string;
    l4_category: string;
    origin: string | null;
    avg_price_per_unit: number;
    units_sold: number;
    nmv: number;
}

export interface GetRecordsParams {
    filters: FilterParams;
    page: number;
    limit: number;
}

export type GetRecordsResponse = PaginatedResponse<Record>;
