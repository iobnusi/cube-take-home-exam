import type { Pool } from "pg";
import type { GetRecordsParams } from "../models/records";
import { buildOrderBy, buildPagination, buildWhere } from "../db/queryBuilder";
import type { SalesRecord } from "../models/records";
import type { PaginatedResponse } from "../models/query";

export class RecordService {
    constructor(private db: Pool) {}

    public async get(
        params: GetRecordsParams
    ): Promise<PaginatedResponse<SalesRecord>> {
        const { sql: whereSql, params: whereParams } = buildWhere(
            params.filters
        );
        const orderBySql = buildOrderBy(params.sort_by, params.sort_dir);
        const { sql: paginationSql, params: paginationParams } =
            buildPagination(params.page, params.limit, whereParams.length);

        const result = await this.db.query<SalesRecord & { total: string }>(
            `
              SELECT *, COUNT(*) OVER () AS total FROM sales
              ${whereSql}
              ${orderBySql}
              ${paginationSql}
            `,
            [...whereParams, ...paginationParams]
        );

        const total = Number(result.rows[0]?.total ?? 0);
        const data = result.rows.map(
            ({ total: _, ...row }) => row as SalesRecord
        );

        return {
            data,
            total,
            page: params.page,
            limit: params.limit,
        };
    }
}
