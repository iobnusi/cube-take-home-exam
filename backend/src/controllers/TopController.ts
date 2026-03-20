import { Controller, Get, Route, Tags, Query } from "tsoa";
import type { TopService } from "../services/TopService";
import type { TopProductsResponse, TopShopsResponse } from "../models/top";
import type { IsMall } from "../models/query";

@Route("/top")
@Tags("Top Products and Shops")
export class TopController extends Controller {
    constructor(private topService: TopService) {
        super();
    }

    @Get("/products")
    public async getTopProducts(
        @Query() rank_by: "nmv" | "units_sold",
        @Query() platform?: string,
        @Query() region?: string,
        @Query() l1_category?: string,
        @Query() l2_category?: string,
        @Query() l3_category?: string,
        @Query() l4_category?: string,
        @Query() is_mall?: IsMall,
        @Query() origin?: string
    ): Promise<TopProductsResponse> {
        return this.topService.getTopProducts({
            rank_by,
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

    @Get("/shops")
    public async getTopShops(
        @Query() rank_by: "nmv" | "units_sold" | "product_count",
        @Query() platform?: string,
        @Query() region?: string,
        @Query() l1_category?: string,
        @Query() l2_category?: string,
        @Query() l3_category?: string,
        @Query() l4_category?: string,
        @Query() is_mall?: IsMall,
        @Query() origin?: string
    ): Promise<TopShopsResponse> {
        return this.topService.getTopShops({
            rank_by,
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
