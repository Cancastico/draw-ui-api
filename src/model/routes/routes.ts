import { Response, Router } from "express";
import { user_router } from "./user_routes";
import { auth_router } from "./auth_routes";

const router = Router();

router.use("/auth", auth_router);
router.use("/users", user_router);
router.get("/", (req, res) => {
  res.send("Hello World!");
});

export { router };
