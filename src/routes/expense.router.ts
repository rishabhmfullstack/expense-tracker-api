import express from "express";
import { fetch_expenses } from "../controllers/expenseController/fetch_expenses";
import { protect } from "../controllers/authController/protect";
import { add_expense } from "../controllers/expenseController/add_expense";
import { update_expense_status } from "../controllers/expenseController/update_expense_status";
import { restrictedTo } from "../controllers/authController/restrictedTo";
import { Role } from "../models/User.model";
import { get_expense_analysis } from "../controllers/expenseController/get_expense_analysis";

const expenseRouter = express.Router();
expenseRouter.use(protect);

expenseRouter.get("/", fetch_expenses);
expenseRouter.post("/add-expense", add_expense);

expenseRouter.use(restrictedTo([Role.ADMIN]));

expenseRouter.patch("/:id/status", update_expense_status);

expenseRouter.get("/get-expense-analytics",get_expense_analysis)

export default expenseRouter;
