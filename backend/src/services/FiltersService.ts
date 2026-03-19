import type { Pool } from "pg";

export class FiltersService {
    constructor(private db: Pool) {}

    public async getRegions(): Promise<string[]> {
        const result = await this.db.query<{ region: string }>(
            `SELECT DISTINCT region FROM sales ORDER BY region`
        );
        return result.rows.map((row) => row.region);
    }

    public async getPlatforms(): Promise<string[]> {
        const result = await this.db.query<{ platform: string }>(
            `SELECT DISTINCT platform FROM sales ORDER BY platform`
        );
        return result.rows.map((row) => row.platform);
    }

    public async getL1Categories(): Promise<string[]> {
        const result = await this.db.query<{ l1_category: string }>(
            `SELECT DISTINCT l1_category FROM sales WHERE l1_category IS NOT NULL ORDER BY l1_category`
        );
        return result.rows.map((row) => row.l1_category);
    }

    public async getL2Categories(l1_category: string): Promise<string[]> {
        const result = await this.db.query<{ l2_category: string }>(
            `
              SELECT DISTINCT l2_category 
              FROM sales 
              WHERE l1_category = $1 AND l2_category IS NOT NULL 
              ORDER BY l2_category
            `,
            [l1_category]
        );
        return result.rows.map((row) => row.l2_category);
    }

    public async getL3Categories(
        l1_category: string,
        l2_category: string
    ): Promise<string[]> {
        const result = await this.db.query<{ l3_category: string }>(
            `
              SELECT DISTINCT l3_category 
              FROM sales 
              WHERE l1_category = $1 AND l2_category = $2 AND l3_category IS NOT NULL 
              ORDER BY l3_category`,
            [l1_category, l2_category]
        );
        return result.rows.map((row) => row.l3_category);
    }

    public async getL4Categories(
        l1_category: string,
        l2_category: string,
        l3_category: string
    ): Promise<string[]> {
        const result = await this.db.query<{ l4_category: string }>(
            `
              SELECT DISTINCT l4_category 
              FROM sales 
              WHERE l1_category = $1 AND l2_category = $2 AND l3_category = $3 AND l4_category IS NOT NULL 
              ORDER BY l4_category
            `,
            [l1_category, l2_category, l3_category]
        );
        return result.rows.map((row) => row.l4_category);
    }
}
