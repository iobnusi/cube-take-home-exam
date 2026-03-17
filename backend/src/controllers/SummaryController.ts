import { Controller, Get, Query, Route, Tags } from "tsoa";
import type { SummaryService } from "../services/SummaryService";
import type {
    SummaryParams,
    SummaryGroupBy,
    SummaryResponse,
} from "../models/summary";
import type { IsMall } from "../models/query";

@Route("/summary")
@Tags("Summary")
export class SummaryController extends Controller {
    constructor(private summaryService: SummaryService) {
        super();
    }

    @Get("/nmv")
    public async getNmvSummary(
        @Query() platform?: string,
        @Query() region?: string,
        @Query() l1_category?: string,
        @Query() l2_category?: string,
        @Query() l3_category?: string,
        @Query() l4_category?: string,
        @Query() is_mall?: IsMall,
        @Query() origin?: string,
        @Query() group_by?: SummaryGroupBy
    ): Promise<SummaryResponse> {
        const params: SummaryParams = {
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
        };
        return this.summaryService.getSummary("nmv", params);
    }

    @Get("/units_sold")
    public async getUnitsSoldSummary(
        @Query() platform?: string,
        @Query() region?: string,
        @Query() l1_category?: string,
        @Query() l2_category?: string,
        @Query() l3_category?: string,
        @Query() l4_category?: string,
        @Query() is_mall?: IsMall,
        @Query() origin?: string,
        @Query() group_by?: SummaryGroupBy
    ): Promise<SummaryResponse> {
        const params: SummaryParams = {
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
        };
        return this.summaryService.getSummary("units_sold", params);
    }

    @Get("/avg_price")
    public async getAvgPriceSummary(
        @Query() platform?: string,
        @Query() region?: string,
        @Query() l1_category?: string,
        @Query() l2_category?: string,
        @Query() l3_category?: string,
        @Query() l4_category?: string
    ): Promise<SummaryResponse> {
        const params: SummaryParams = {
            filters: {
                platform,
                region,
                l1_category,
                l2_category,
                l3_category,
                l4_category,
            },
        };
        return this.summaryService.getSummary("avg_price", params);
    }

    @Get("/products")
    public async getUniqueProductsSummary(
        @Query() platform?: string,
        @Query() region?: string,
        @Query() l1_category?: string,
        @Query() l2_category?: string,
        @Query() l3_category?: string,
        @Query() l4_category?: string,
        @Query() is_mall?: IsMall,
        @Query() origin?: string,
        @Query() group_by?: SummaryGroupBy
    ): Promise<SummaryResponse> {
        const params: SummaryParams = {
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
        };
        return this.summaryService.getSummary("unique_products", params);
    }

    @Get("/shops")
    public async getUniqueShopsSummary(
        @Query() platform?: string,
        @Query() region?: string,
        @Query() l1_category?: string,
        @Query() l2_category?: string,
        @Query() l3_category?: string,
        @Query() l4_category?: string,
        @Query() is_mall?: IsMall,
        @Query() origin?: string,
        @Query() group_by?: SummaryGroupBy
    ): Promise<SummaryResponse> {
        const params: SummaryParams = {
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
        };
        return this.summaryService.getSummary("unique_shops", params);
    }
}
