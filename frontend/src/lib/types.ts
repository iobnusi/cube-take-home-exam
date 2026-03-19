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

export interface SummaryBreakdownItem {
  group: string;
  value: number;
}

export interface SummaryResponse {
  metric: SummaryMetric;
  total: number;
  breakdown?: {
    group_by: SummaryGroupBy;
    items: SummaryBreakdownItem[];
  };
}

export type TrendGroupBy = "platform" | "region";

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

export interface SalesRecord {
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
  status?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type GetRecordsResponse = PaginatedResponse<SalesRecord>;

export interface FilterParams {
  platform?: string;
  region?: string;
  from?: string;
  to?: string;
}
