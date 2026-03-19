import type {
    FilterParams,
    GetRecordsResponse,
    SummaryMetric,
    SummaryResponse,
    TrendGroupBy,
    TrendResponse,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

function buildQuery(
    params: Record<string, string | number | undefined>
): string {
    const entries = Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== "" && v !== null
    );
    if (entries.length === 0) return "";
    return (
        "?" +
        new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString()
    );
}

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

export async function fetchL1Categories(): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/filters/l1_categories`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch /filters/l1_categories");
    return res.json() as Promise<string[]>;
}

export async function fetchL2Categories(l1: string): Promise<string[]> {
    const qs = buildQuery({ l1_category: l1 });
    const res = await fetch(`${BASE_URL}/filters/l2_categories${qs}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch /filters/l2_categories");
    return res.json() as Promise<string[]>;
}

export async function fetchL3Categories(
    l1: string,
    l2: string
): Promise<string[]> {
    const qs = buildQuery({ l1_category: l1, l2_category: l2 });
    const res = await fetch(`${BASE_URL}/filters/l3_categories${qs}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch /filters/l3_categories");
    return res.json() as Promise<string[]>;
}

export async function fetchL4Categories(
    l1: string,
    l2: string,
    l3: string
): Promise<string[]> {
    const qs = buildQuery({
        l1_category: l1,
        l2_category: l2,
        l3_category: l3,
    });
    const res = await fetch(`${BASE_URL}/filters/l4_categories${qs}`, {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch /filters/l4_categories");
    return res.json() as Promise<string[]>;
}

export async function fetchRecords(
    filters: FilterParams,
    page: number,
    limit: number
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
    });
    const res = await fetch(`${BASE_URL}/records${qs}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch /records");
    return res.json() as Promise<GetRecordsResponse>;
}
