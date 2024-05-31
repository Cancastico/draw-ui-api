import { Router } from "express";
import { error_middleware } from "../middlewares/errorMiddleware/error_middleware";
import { user_controller } from "../../controller/user_controller";

const error_middleware_instance = new error_middleware();
const user = new user_controller();
const user_router = Router();

user_router.post("/", error_middleware_instance.handleAsync(user.create));
user_router.get("/", error_middleware_instance.handleAsync(user.get));
user_router.get(
  "/email",
  error_middleware_instance.handleAsync(user.get_email),
);
user_router.put("/", error_middleware_instance.handleAsync(user.update));
user_router.delete("/:id", error_middleware_instance.handleAsync(user.get));

export { user_router };
