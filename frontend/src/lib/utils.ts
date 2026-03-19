import { FilterParams } from "./types";

export function filtersFromParams(
    params: Record<string, string | undefined>
): FilterParams {
    return {
        platform: params.platform,
        region: params.region,
        from: params.from,
        to: params.to,
        l1_category: params.l1_category,
        l2_category: params.l2_category,
        l3_category: params.l3_category,
        l4_category: params.l4_category,
    };
}

export function buildQuery(
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
