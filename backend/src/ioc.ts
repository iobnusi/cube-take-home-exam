import type { IocContainer } from "tsoa";
import pool from "./db";
import { RecordService } from "./services/RecordService";
import { RecordController } from "./controllers/RecordController";
import { SummaryController } from "./controllers/SummaryController";
import { SummaryService } from "./services/SummaryService";
import { TrendController } from "./controllers/TrendController";
import { TrendService } from "./services/TrendService";
import { FiltersController } from "./controllers/FiltersController";
import { FiltersService } from "./services/FiltersService";
import { TopController } from "./controllers/TopController";
import { TopService } from "./services/TopService";

const controllers = new Map<unknown, unknown>([
    [RecordController, new RecordController(new RecordService(pool))],
    [SummaryController, new SummaryController(new SummaryService(pool))],
    [TrendController, new TrendController(new TrendService(pool))],
    [FiltersController, new FiltersController(new FiltersService(pool))],
    [TopController, new TopController(new TopService(pool))],
]);

export const iocContainer: IocContainer = {
    get<T>(controller: new (...args: unknown[]) => T): T {
        const instance = controllers.get(controller);
        if (instance) return instance as T;
        return new controller();
    },
};
