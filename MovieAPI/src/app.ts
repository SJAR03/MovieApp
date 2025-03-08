import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swagger";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";

const app : Application = express();

app.use(express.json());

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', routes);

// Middleware to handle errors
app.use((err: any, req: any, res: any, next: any) => {
    errorHandler(err, req, res, next);
});

export default app;