import { Controller, Get, Query, Route, Tags } from "tsoa";
import type { FiltersService } from "../services/FiltersService";
import type { Category, FilterCategoriesResult } from "../models/filters";

@Route("/filters")
@Tags("Filters")
export class FiltersController extends Controller {
    constructor(private filtersService: FiltersService) {
        super();
    }

    @Get("/regions")
    public async getRegions(): Promise<string[]> {
        return this.filtersService.getRegions();
    }

    @Get("/platforms")
    public async getPlatforms(): Promise<string[]> {
        return this.filtersService.getPlatforms();
    }

    @Get("/l1_categories")
    public async getL1Categories(): Promise<string[]> {
        return this.filtersService.getL1Categories();
    }

    @Get("/l2_categories")
    public async getL2Categories(
        @Query("l1_category") l1_category: string
    ): Promise<string[]> {
        return this.filtersService.getL2Categories(l1_category);
    }

    @Get("/l3_categories")
    public async getL3Categories(
        @Query("l1_category") l1_category: string,
        @Query("l2_category") l2_category: string
    ): Promise<string[]> {
        return this.filtersService.getL3Categories(l1_category, l2_category);
    }

    @Get("/l4_categories")
    public async getL4Categories(
        @Query("l1_category") l1_category: string,
        @Query("l2_category") l2_category: string,
        @Query("l3_category") l3_category: string
    ): Promise<string[]> {
        return this.filtersService.getL4Categories(
            l1_category,
            l2_category,
            l3_category
        );
    }
}
