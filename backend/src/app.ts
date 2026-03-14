import express, { type Request, type Response } from "express";
import cors from "cors";
import { RegisterRoutes } from "./generated/routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../public/swagger.json" assert { type: "json" };

const app = express();

app.use(cors());

// For parsing JSON bodies
app.use(express.json());

// For parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// TSOA generator to convert controllers into Express routes
RegisterRoutes(app);

// For serving Open API docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: "Not Found" });
});

export { app };
