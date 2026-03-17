import type { Pool } from "pg";
import type { GetRecordsParams } from "../models/records";
import { buildPagination, buildWhere } from "../db/queryBuilder";
import type { Record } from "../models/records";
import type { PaginatedResponse } from "../models/query";

export class RecordService {
    constructor(private db: Pool) {}

    public async get(
        params: GetRecordsParams
    ): Promise<PaginatedResponse<Record>> {
        const { sql: whereSql, params: whereParams } = buildWhere(
            params.filters
        );
        const { sql: paginationSql, params: paginationParams } =
            buildPagination(params.page, params.limit, whereParams.length);

        const result = await this.db.query<Record & { total: string }>(
            `
              SELECT *, COUNT(*) OVER () AS total FROM sales
              ${whereSql}
              ORDER BY period DESC
              ${paginationSql}
            `,
            [...whereParams, ...paginationParams]
        );

        const total = Number(result.rows[0]?.total ?? 0);
        const data = result.rows.map(({ total: _, ...row }) => row as Record);

        return {
            data,
            total,
            page: params.page,
            limit: params.limit,
        };
    }
}
