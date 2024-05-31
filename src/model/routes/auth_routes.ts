import { Router } from "express";
import { error_middleware } from "../middlewares/errorMiddleware/error_middleware";
import { auth_controller } from "../../controller/auth_controller";

const error_middleware_instance = new error_middleware();
const auth = new auth_controller();
const auth_router = Router();

auth_router.post("/login", error_middleware_instance.handleAsync(auth.login));
auth_router.post(
  "/register",
  error_middleware_instance.handleAsync(auth.register),
);

export { auth_router };
