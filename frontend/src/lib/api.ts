import type {
    FilterParams,
    GetRecordsResponse,
    SummaryMetric,
    SummaryResponse,
    TrendGroupBy,
    TrendResponse,
} from "./types";
import { BASE_URL } from "./constants";
import { buildQuery } from "./utils";

export async function fetchSummaryMetric(
    metric: SummaryMetric,
    filters: FilterParams
): Promise<SummaryResponse> {
    const endpointMap: Record<SummaryMetric, string> = {
        nmv: "nmv",
        units_sold: "units_sold",
        avg_price: "avg_price",
        unique_products: "products",
        unique_shops: "shops",
    };
    const qs = buildQuery({
        platform: filters.platform,
        region: filters.region,
        l1_category: filters.l1_category,
        l2_category: filters.l2_category,
        l3_category: filters.l3_category,
        l4_category: filters.l4_category,
        origin: filters.origin,
        is_mall: filters.is_mall,
    });
    const res = await fetch(`${BASE_URL}/summary/${endpointMap[metric]}${qs}`, {
        cache: "no-store",
    });
    if (!res.ok)
        throw new Error(`Failed to fetch /summary/${endpointMap[metric]}`);
    return res.json() as Promise<SummaryResponse>;
}

export async function fetchAllSummaries(
    filters: FilterParams
): Promise<SummaryResponse[]> {
    const metrics: SummaryMetric[] = [
        "nmv",
        "units_sold",
        "avg_price",
        "unique_products",
        "unique_shops",
    ];
    return Promise.all(metrics.map((m) => fetchSummaryMetric(m, filters)));
}

export async function fetchTrends(
    filters: FilterParams,
    groupBy?: TrendGroupBy
): Promise<TrendResponse> {
    const qs = buildQuery({
        platform: filters.platform,
        region: filters.region,
        l1_category: filters.l1_category,
        l2_category: filters.l2_category,
        l3_category: filters.l3_category,
        l4_category: filters.l4_category,
        origin: filters.origin,
        is_mall: filters.is_mall,
        group_by: groupBy,
    });
    const res = await fetch(`${BASE_URL}/trends${qs}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch /trends");
    return res.json() as Promise<TrendResponse>;
}

export async function fetchRecords(
    filters: FilterParams,
    page: number,
    limit: number,
    sort_by?: string,
    sort_dir?: string
): Promise<GetRecordsResponse> {
    const qs = buildQuery({
        platform: filters.platform,
        region: filters.region,
        from: filters.from,
        to: filters.to,
        l1_category: filters.l1_category,
        l2_category: filters.l2_category,
        l3_category: filters.l3_category,
        l4_category: filters.l4_category,
        origin: filters.origin,
        is_mall: filters.is_mall,
        page,
        limit,
        sort_by,
        sort_dir,
    });
    const res = await fetch(`${BASE_URL}/records${qs}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch /records");
    return res.json() as Promise<GetRecordsResponse>;
}
