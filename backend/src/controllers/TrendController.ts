import { Controller, Get, Query, Route, Tags } from "tsoa";
import type { TrendService } from "../services/TrendService";
import type { TrendResponse, TrendGroupBy } from "../models/trends";
import type { IsMall } from "../models/query";

@Route("/trends")
@Tags("Trends")
export class TrendController extends Controller {
    constructor(private trendService: TrendService) {
        super();
    }

    @Get("/")
    public async getTrends(
        @Query() platform?: string,
        @Query() region?: string,
        @Query() l1_category?: string,
        @Query() l2_category?: string,
        @Query() l3_category?: string,
        @Query() l4_category?: string,
        @Query() is_mall?: IsMall,
        @Query() origin?: string,
        @Query() group_by?: TrendGroupBy
    ): Promise<TrendResponse> {
        return this.trendService.getTrends({
            group_by,
            filters: {
                platform,
                region,
                l1_category,
                l2_category,
                l3_category,
                l4_category,
                is_mall,
                origin,
            },
        });
    }
}
