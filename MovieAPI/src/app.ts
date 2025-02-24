import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swagger";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";

const app : Application = express();

app.use(express.json());

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', routes);

app.use(errorHandler);

export default app;