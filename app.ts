import express from "express";
import "reflect-metadata";
import { sequelize } from "./src/config/sequelize";
import { globalErrorHandler } from "./utils/errorController";
import AppError from "./utils/appError";
import { catchAsync } from "./utils/catchAsync";
import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";
import userRouter from "./src/routes/user.router";
import cookieParser from "cookie-parser";
import expenseRouter from "./src/routes/expense.router";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cookieParser());

sequelize.sync().then(() => {
  console.log("✅ DB synced in app.ts");
});
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
app.get("/health", (_, res) => {
  res.send("success");
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/expense", expenseRouter);

// app.all(
//   "/:splat",
//   catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     throw new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
//   })
// );
app.use(globalErrorHandler);
export default app;
