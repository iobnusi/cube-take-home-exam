import type { IocContainer } from "tsoa";
import { RootController } from "./controllers/RootController";
import pool from "./db";

const controllers = new Map<unknown, unknown>([
    [RootController, new RootController(pool)],
]);

export const iocContainer: IocContainer = {
    get<T>(controller: new (...args: unknown[]) => T): T {
        const instance = controllers.get(controller);
        if (instance) return instance as T;
        return new controller();
    },
};
