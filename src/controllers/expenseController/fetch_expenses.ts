import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import AppError from "../../../utils/appError";
import { Role, User } from "../../models/User.model";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../../../utils/interface";
import { Expense } from "../../models/Expense.model";

export const fetch_expenses = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id, role } = req.user as User;
    let expense: Expense[];
    if (role === Role.ADMIN) {
      expense = await Expense.findAll({
        include: [{ model: User, attributes: { exclude: ["password"] } }],
      });
    } else {
      expense = await Expense.findAll({
        where: { userId: id },
        include: [{ model: User, attributes: { exclude: ["password"] } }],
      });
    }
    res.status(StatusCodes.OK).json({
      status: "success",
      data: expense,
    });
  }
);
