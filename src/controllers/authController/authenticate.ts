import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import AppError from "../../../utils/appError";
import { User } from "../../models/User.model";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { MyJwtPayload } from "../../../utils/interface";

export const authenticate = catchAsync(async (req: Request, res: Response) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError(
      "JWT_SECRET not found",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
  console.log("req.cookies", req.cookies);

  if (!req.cookies?.jwt) {
    throw new AppError("Please login to get access", StatusCodes.UNAUTHORIZED);
  }

  let decode: MyJwtPayload;
  try {
    decode = jwt.verify(
      req.cookies.jwt,
      process.env.JWT_SECRET
    ) as MyJwtPayload;
  } catch (error) {
    throw new AppError(
      "Invalid token. Please login again.",
      StatusCodes.UNAUTHORIZED
    );
  }

  const currentUser = await User.findOne({ where: { id: decode.id } });

  if (!currentUser) {
    throw new AppError(
      "This user does not belong to this token",
      StatusCodes.UNAUTHORIZED
    );
  }
  setTimeout(() => {
    res.status(StatusCodes.OK).json({
      status: "success",
      user: currentUser,
    });
  }, 5000);
});
