import type { Pool } from "pg";
import { Controller, Get, Route } from "tsoa";

@Route("/")
export class RootController extends Controller {
    constructor(private db: Pool) {
        super();
    }

    @Get("/")
    public async getRoot(): Promise<{ message: string; dbResult: unknown }> {
        // test db connection
        const result = await this.db.query("SELECT 1");
        return { message: "Hello World!", dbResult: result.rows[0] };
    }
}
