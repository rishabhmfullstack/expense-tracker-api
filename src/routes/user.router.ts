import express from "express";
import { sign_up } from "../controllers/authController/sign_up";
import { log_in } from "../controllers/authController/log_in";
import { authenticate } from "../controllers/authController/authenticate";

const userRouter = express.Router();

userRouter.post("/sign-up", sign_up);
userRouter.post("/log-in", log_in);
userRouter.get("/authenticate", authenticate);

export default userRouter;
