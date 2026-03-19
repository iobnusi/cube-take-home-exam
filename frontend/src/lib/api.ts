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
        group_by: groupBy,
    });
    const res = await fetch(`${BASE_URL}/trends${qs}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch /trends");
    return res.json() as Promise<TrendResponse>;
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
        page,
        limit,
    });
    const res = await fetch(`${BASE_URL}/records${qs}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch /records");
    return res.json() as Promise<GetRecordsResponse>;
}
