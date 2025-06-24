import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import AppError from "../../../utils/appError";
import { User } from "../../models/User.model";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import { signToken } from "../../../utils/signToken";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../../../utils/interface";
interface JwtPayload {
  id: number; // or string, whatever your User ID type is
  iat?: number;
  exp?: number;
}
export const protect = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return new AppError(
        "You are not logged in! Please log in to get access",
        StatusCodes.UNAUTHORIZED
      );
    }
    if (!process.env.JWT_SECRET) {
      return new AppError("JWT_SECRET not found", StatusCodes.UNAUTHORIZED);
    }
    const decode = (await jwt.verify(
      token,
      process.env.JWT_SECRET
    )) as JwtPayload;

    const currentUser = await User.findOne({ where: { id: decode.id } });

    if (!currentUser) {
      return new AppError(
        "The user belonging to this token does no longer exist.",
        StatusCodes.UNAUTHORIZED
      );
    }
    req.user = currentUser;
    next();
  }
);
