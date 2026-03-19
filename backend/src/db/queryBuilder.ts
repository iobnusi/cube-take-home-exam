import type { FilterParams } from "../models/query";

export function buildWhere(filters: FilterParams): {
    sql: string;
    params: unknown[];
} {
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (filters.platform) {
        params.push(filters.platform);
        conditions.push(`platform = $${params.length}`);
    }

    if (filters.region) {
        params.push(filters.region);
        conditions.push(`region = $${params.length}`);
    }

    if (filters.is_mall !== undefined) {
        if (filters.is_mall === "other") {
            conditions.push(`is_mall IS NULL`);
        } else {
            params.push(filters.is_mall === "true");
            conditions.push(`is_mall = $${params.length}`);
        }
    }

    if (filters.origin) {
        params.push(filters.origin);
        conditions.push(`origin = $${params.length}`);
    }

    if (filters.l1_category) {
        params.push(filters.l1_category);
        conditions.push(`l1_category = $${params.length}`);
    }

    if (filters.l2_category) {
        params.push(filters.l2_category);
        conditions.push(`l2_category = $${params.length}`);
    }

    if (filters.l3_category) {
        params.push(filters.l3_category);
        conditions.push(`l3_category = $${params.length}`);
    }

    if (filters.l4_category) {
        params.push(filters.l4_category);
        conditions.push(`l4_category = $${params.length}`);
    }
    if (filters.from) {
        params.push(filters.from);
        conditions.push(`period >= $${params.length}`);
    }

    if (filters.to) {
        params.push(filters.to);
        conditions.push(`period <= $${params.length}`);
    }

    return {
        sql: conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "",
        params,
    };
}

const SORTABLE_COLUMNS = new Set([
    "period",
    "platform",
    "region",
    "nmv",
    "units_sold",
    "avg_price_per_unit",
]);

export type SortDir = "asc" | "desc";

export function buildOrderBy(
    sortBy?: string,
    sortDir?: SortDir
): string {
    if (!sortBy || !SORTABLE_COLUMNS.has(sortBy)) {
        return "ORDER BY period DESC";
    }
    const dir = sortDir === "asc" ? "ASC" : "DESC";
    return `ORDER BY ${sortBy} ${dir}`;
}

export function buildPagination(
    page: number,
    limit: number,
    paramOffset = 0
): {
    sql: string;
    params: unknown[];
} {
    const limitIdx = paramOffset + 1;
    const offsetIdx = paramOffset + 2;
    return {
        sql: `LIMIT $${limitIdx.toString()} OFFSET $${offsetIdx.toString()}`,
        params: [limit, (page - 1) * limit],
    };
}
