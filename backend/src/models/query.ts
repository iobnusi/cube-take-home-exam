export type IsMall = "true" | "false" | "other";

export interface FilterParams {
    platform?: string;
    region?: string;
    is_mall?: IsMall;
    origin?: string;
    l1_category?: string;
    l2_category?: string;
    l3_category?: string;
    l4_category?: string;
    from?: string;
    to?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}
