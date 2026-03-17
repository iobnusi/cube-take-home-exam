import type { Pool } from "pg";
import { buildWhere } from "../db/queryBuilder";
import type {
    SummaryMetric,
    SummaryParams,
    SummaryResponse,
} from "../models/summary";

const VALID_GROUP_BY = new Set<string>([
    "platform",
    "region",
    "is_mall",
    "origin",
    "l1_category",
    "l2_category",
    "l3_category",
    "l4_category",
]);

export class SummaryService {
    constructor(private db: Pool) {}

    public async getSummary(
        metric: SummaryMetric,
        params: SummaryParams
    ): Promise<SummaryResponse> {
        const { sql: whereSql, params: whereParams } = buildWhere(
            params.filters
        );

        let aggregate: string;
        switch (metric) {
            case "nmv":
                aggregate = "SUM(nmv)";
                break;
            case "units_sold":
                aggregate = "SUM(units_sold)";
                break;
            case "avg_price":
                aggregate = "SUM(nmv) / NULLIF(SUM(units_sold), 0)";
                break;
            case "unique_products":
                aggregate = "COUNT(DISTINCT product_id)";
                break;
            case "unique_shops":
                aggregate = "COUNT(DISTINCT shop_id)";
                break;
            default:
                throw new Error(`Invalid metric: ${metric}`);
        }

        // always run the total query
        const queries = [`SELECT ${aggregate} AS total FROM sales ${whereSql}`];

        // add additional group query if group_by is provided
        if (params.group_by) {
            if (!VALID_GROUP_BY.has(params.group_by)) {
                throw new Error(`Invalid group_by: ${params.group_by}`);
            }
            if (metric === "avg_price") {
                throw new Error(
                    "Grouping by on avg_price summary is not allowed"
                );
            }

            queries.push(
                `SELECT ${params.group_by} AS "group", ${aggregate} AS total FROM sales ${whereSql} GROUP BY ${params.group_by} ORDER BY total DESC`
            );
        }

        const summaryResults = await Promise.all(
            queries.map((query) => this.db.query(query, whereParams))
        );

        return {
            metric,
            total: Number(
                (summaryResults[0]?.rows[0] as { total: string }).total || 0
            ),
            breakdown:
                params.group_by &&
                summaryResults.length > 1 &&
                summaryResults[1]
                    ? {
                          group_by: params.group_by,
                          items: (
                              summaryResults[1].rows as {
                                  group: string;
                                  total: string;
                              }[]
                          ).map((row) => ({
                              group: row.group,
                              value: Number(row.total),
                          })),
                      }
                    : undefined,
        };
    }
}
