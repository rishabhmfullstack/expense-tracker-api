import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import AppError from "../../../utils/appError";
import { Role, User } from "../../models/User.model";
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
export const restrictedTo = (roles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return next(
        new AppError("User role is undefined. Please login again.", StatusCodes.FORBIDDEN)
      );
    }

    if (!roles.includes(req.user.role as Role)) {
      return next(
        new AppError("You do not have permission to perform this action", StatusCodes.FORBIDDEN)
      );
    }
    next();
  };
};
