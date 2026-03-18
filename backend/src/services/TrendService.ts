import type { Pool } from "pg";
import type {
    TrendDataPoint,
    TrendParams,
    TrendResponse,
} from "../models/trends";
import { buildWhere } from "../db/queryBuilder";

const VALID_GROUP_BY = new Set<string>(["platform", "region"]);

export class TrendService {
    constructor(private db: Pool) {}

    public async getTrends(params: TrendParams): Promise<TrendResponse> {
        const { sql: whereSql, params: whereParams } = buildWhere(
            params.filters
        );

        let orderGroupBy = "";
        let groupByColumn = "";
        if (params.group_by) {
            if (!VALID_GROUP_BY.has(params.group_by)) {
                throw new Error(`Invalid group_by: ${params.group_by}`);
            }
            orderGroupBy = `,${params.group_by}`;
            groupByColumn = `,${params.group_by} AS "group"`;
        }

        const sql = `
            SELECT 
                DATE_TRUNC('month', period) AS period,
                SUM(nmv) AS nmv,
                SUM(units_sold) AS units_sold,
                SUM(nmv) / NULLIF(SUM(units_sold), 0) AS avg_price_per_unit,
                SUM(nmv) / NULLIF(COUNT(DISTINCT shop_id), 0) AS nmv_per_shop,
                COUNT(DISTINCT product_id) AS active_products,
                COUNT(DISTINCT shop_id) AS active_shops
                ${groupByColumn}
            FROM sales
            ${whereSql}
            GROUP BY DATE_TRUNC('month', period) ${orderGroupBy}
            ORDER BY period ASC
        `;

        const result = await this.db.query<TrendDataPoint>(sql, whereParams);

        return {
            data: result.rows.reduce<TrendResponse["data"]>((acc, row) => {
                const key = row.group;
                // if no key, means that no group by was provided
                if (!key) {
                    if ("all" in acc) {
                        acc.all.push(row);
                    } else {
                        acc.all = [row];
                    }
                    return acc;
                }

                if (key in acc) {
                    acc[key]?.push(row);
                } else {
                    acc[key] = [row];
                }
                return acc;
            }, {}),
        };
    }
}
