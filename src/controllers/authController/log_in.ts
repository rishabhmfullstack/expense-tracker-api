import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import AppError from "../../../utils/appError";
import { User } from "../../models/User.model";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { signToken } from "../../../utils/signToken";

export const log_in = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return next(
        new AppError(
          "Please provide email and password",
          StatusCodes.BAD_REQUEST
        )
      );
    }

    // 2. Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return next(
        new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED)
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(
        new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED)
      );
    }

    const token = signToken(user.id);

    res.cookie("jwt", token, {
      httpOnly: true,
      // secure: req.secure || req.headers["x-forwarded-proto"] === "https",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userSafe } = user.get({ plain: true });

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Logged in successfully",
      user: userSafe,
    });
  }
);
