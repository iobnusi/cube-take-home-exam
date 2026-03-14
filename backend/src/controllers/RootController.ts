import { Controller, Get, Route } from "tsoa";

@Route("/")
export class RootController extends Controller {
    @Get("/")
    public getRoot(): { message: string } {
        return { message: "Hello World!" };
    }
}
