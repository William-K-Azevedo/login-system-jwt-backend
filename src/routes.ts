import { Router } from "express";
import arquivoRouter from "./app/routes/UserRoutes";

const routes = Router();

routes.use(arquivoRouter);

export default routes;
