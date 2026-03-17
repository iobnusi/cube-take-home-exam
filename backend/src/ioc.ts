import type { IocContainer } from "tsoa";
import pool from "./db";
import { RecordService } from "./services/RecordService";
import { RecordController } from "./controllers/RecordController";

const controllers = new Map<unknown, unknown>([
    [RecordController, new RecordController(new RecordService(pool))],
]);

export const iocContainer: IocContainer = {
    get<T>(controller: new (...args: unknown[]) => T): T {
        const instance = controllers.get(controller);
        if (instance) return instance as T;
        return new controller();
    },
};
