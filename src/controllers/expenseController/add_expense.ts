import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import AppError from "../../../utils/appError";
import { User } from "../../models/User.model";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, Category } from "../../../utils/interface";
import { Expense } from "../../models/Expense.model";

export const add_expense = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.user as User;
    const { category, description, amount } = req.body;

    if (!Object.values(Category).includes(category)) {
      throw new AppError("Invalid expense category", StatusCodes.BAD_REQUEST);
    }
    const expenses =await Expense.create({
      category,
      description,
      amount,
      userId: id,
    });
    res.status(StatusCodes.OK).json({
      status: "success",
      data: expenses,
    });
  }
);
