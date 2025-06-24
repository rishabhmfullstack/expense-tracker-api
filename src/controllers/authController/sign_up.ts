import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import AppError from "../../../utils/appError";
import { User } from "../../models/User.model";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import validator from "validator";

export const sign_up = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(
        new AppError(
          "Please provide name, email and password",
          StatusCodes.BAD_REQUEST
        )
      );
    }
    if (!validator.isEmail(email)) {
      return next(
        new AppError(
          "Please provide a valid email address",
          StatusCodes.BAD_REQUEST
        )
      );
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(
        new AppError("User exist with this email", StatusCodes.CONFLICT)
      );
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: passwordHash,
    });
    const { password: _, ...userSafe } = user.get({ plain: true });

    res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      status: "success",
      data: { ...userSafe },
    });
  }
);
