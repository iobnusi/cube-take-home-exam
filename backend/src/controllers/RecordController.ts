import { Controller, Get, Query, Route } from "tsoa";
import type { GetRecordsResponse } from "../models/records";
import type { RecordService } from "../services/RecordService";
import type { IsMall } from "../models/query";

@Route("/records")
export class RecordController extends Controller {
    constructor(private recordService: RecordService) {
        super();
    }

    @Get("/")
    public async getRecords(
        @Query() page = 1,
        @Query() limit = 20,
        @Query() platform?: string,
        @Query() region?: string,
        @Query() is_mall?: IsMall,
        @Query() origin?: string,
        @Query() l1_category?: string,
        @Query() l2_category?: string,
        @Query() l3_category?: string,
        @Query() l4_category?: string,
        @Query() from?: string,
        @Query() to?: string
    ): Promise<GetRecordsResponse> {
        const safePage = Math.max(1, page);
        const safeLimit = Math.min(100, Math.max(1, limit));

        const response = await this.recordService.get({
            page: safePage,
            limit: safeLimit,
            filters: {
                platform,
                region,
                is_mall,
                origin,
                l1_category,
                l2_category,
                l3_category,
                l4_category,
                from,
                to,
            },
        });
        return response;
    }
}
