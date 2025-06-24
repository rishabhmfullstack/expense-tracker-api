import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import AppError from "../../../utils/appError";
import { StatusCodes } from "http-status-codes";
import { AuthenticatedRequest } from "../../../utils/interface";
import { Expense } from "../../models/Expense.model";
import { Status } from "../../../utils/interface";

export const update_expense_status = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id: expenseId } = req.params;
    const { status } = req.body;

    if (!Object.values(Status).includes(status)) {
      throw new AppError("Invalid status value", StatusCodes.BAD_REQUEST);
    }

    const expense = await Expense.findByPk(expenseId);

    if (!expense) {
      throw new AppError("Expense not found", StatusCodes.NOT_FOUND);
    }

    expense.status = status;
    await expense.save();

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Expense status updated successfully",
      data: expense,
    });
  }
);
