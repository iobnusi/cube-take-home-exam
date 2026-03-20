import type { Pool } from "pg";
import { buildWhere } from "../db/queryBuilder";
import type {
    TopDataPoint,
    TopProductsParams,
    TopProductsResponse,
    TopShopsParams,
    TopShopsResponse,
} from "../models/top";

export class TopService {
    constructor(private db: Pool) {}

    public async getTopProducts(
        params: TopProductsParams
    ): Promise<TopProductsResponse> {
        const { sql: whereSql, params: whereParams } = buildWhere(
            params.filters
        );

        const aggregate = `,
          ${params.rank_by === "nmv" ? "SUM(nmv)" : " SUM(units_sold)"}
        `;

        const sql = `
            SELECT 
                product_id as id
                ${aggregate} as value
            FROM sales
            ${whereSql}
            GROUP BY product_id
            ORDER BY value DESC
            LIMIT 10
        `;
        const result = await this.db.query<TopDataPoint>(sql, [...whereParams]);

        return {
            products: result.rows.map((row) => ({
                id: row.id,
                value: row.value,
            })),
        };
    }

    public async getTopShops(
        params: TopShopsParams
    ): Promise<TopShopsResponse> {
        const { sql: whereSql, params: whereParams } = buildWhere(
            params.filters
        );

        let aggregate = "";

        switch (params.rank_by) {
            case "nmv":
                aggregate = "SUM(nmv)";
                break;
            case "units_sold":
                aggregate = "SUM(units_sold)";
                break;
            case "product_count":
                aggregate = "COUNT(DISTINCT product_id)";
                break;
        }

        const sql = `
          SELECT 
              shop_id as id
              ${aggregate} as value
          FROM sales
          ${whereSql}
          GROUP BY shop_id
          ORDER BY value DESC
          LIMIT 10
      `;
        const result = await this.db.query<TopDataPoint>(sql, [...whereParams]);

        return {
            shops: result.rows.map((row) => ({
                id: row.id,
                value: row.value,
            })),
        };
    }
}
