import { Router } from "express";
import { AuthRoutes } from "./auth/routes";
import { EncuestaRoutes } from "./encuestas/routes";

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    router.use("/api/auth", AuthRoutes.routes);
    router.use("/api/encuestas", EncuestaRoutes.routes);
    return router;
  }
}
