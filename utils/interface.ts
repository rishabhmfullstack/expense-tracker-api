import { JwtPayload } from "jsonwebtoken";

import { Request } from "express";
import { User } from "../src/models/User.model";
export interface MyJwtPayload extends JwtPayload {
  id: string;
}

export enum Category {
  GROCERIES = "Groceries",
  TRANSPORTATION = "Transportation",
  UTILITIES = "Utilities",
  RENT = "Rent",
  ENTERTAINMENT = "Entertainment",
  HEALTHCARE = "Healthcare",
  EDUCATION = "Education",
  DINING_OUT = "Dining Out",
  TRAVEL = "Travel",
  SUBSCRIPTIONS = "Subscriptions",
  INSURANCE = "Insurance",
  SAVINGS = "Savings",
  INVESTMENTS = "Investments",
  GIFTS = "Gifts & Donations",
  PERSONAL_CARE = "Personal Care",
  HOUSEHOLD = "Household",
  DEBT = "Debt Payments",
  PETS = "Pets",
  CHILDCARE = "Childcare",
  TAXES = "Taxes",
  MISC = "Miscellaneous",
}

export enum Status {
  REJECTED = "Reject",
  APPROVED = "Approve",
  PENDING = "Pending"
}

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface ExpenseCreationAttributes {
  amount: number;
  category: Category;
  description: string;
  userId: string;
}
