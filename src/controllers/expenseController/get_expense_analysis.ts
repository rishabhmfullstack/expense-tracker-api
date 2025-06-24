import { Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import { sequelize } from "../../config/sequelize";
import { Expense } from "../../models/Expense.model";
import { User } from "../../models/User.model";
import { AuthenticatedRequest } from "../../../utils/interface";
import moment from "moment";

// ✅ Install moment and types before use:
// npm install moment && npm install -D @types/moment

export const get_expense_analysis = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    await sequelize.transaction(async (t) => {
      const [
        totalExpenses,
        totalAmountRaw,
        averageAmountRaw,
        pendingApprovals,
      ] = await Promise.all([
        Expense.count({ transaction: t }),
        Expense.sum("amount", { transaction: t }),
        Expense.aggregate("amount", "avg", { transaction: t }),
        Expense.count({ where: { status: "Pending" }, transaction: t }),
      ]);

      const totalAmount = Number(totalAmountRaw) || 0;
      const averageAmount = Number(averageAmountRaw) || 0;

      const allExpensesRaw = await Expense.findAll({
        include: [{ model: User, attributes: ["name"] }],
        order: [["createdAt", "DESC"]],
        transaction: t,
        raw: true,
        nest: true,
      });

      const uniqueCategories = [
        ...new Set(allExpensesRaw.map((e) => (e as any).category)),
      ];

      const expensesList = allExpensesRaw.map((e) => {
        const anyE = e as any;
        return {
          id: anyE.id,
          name: anyE.name,
          amount: Number(anyE.amount),
          date: moment(anyE.createdAt).format("YYYY-MM-DD"),
          category: anyE.category,
          status: anyE.status as string,
          user: anyE.user.name as string,
        };
      });

      const categoryDistRaw = await Expense.findAll({
        attributes: [
          "category",
          [sequelize.fn("SUM", sequelize.col("amount")), "value"],
        ],
        group: ["category"],
        transaction: t,
        raw: true,
      });

      const statusDistRaw = await Expense.findAll({
        attributes: [
          "status",
          [sequelize.fn("COUNT", sequelize.col("status")), "statusCount"],
        ],
        group: ["status"],
        transaction: t,
        raw: true,
      });

      const monthlyRaw = await Expense.findAll({
        attributes: [
          [
            sequelize.fn(
              "TO_CHAR",
              sequelize.fn("DATE_TRUNC", "month", sequelize.col("createdAt")),
              "YYYY-MM"
            ),
            "month",
          ],
          [sequelize.fn("SUM", sequelize.col("amount")), "total"],
        ],
        group: [
          sequelize.fn("DATE_TRUNC", "month", sequelize.col("createdAt")),
        ],
        order: [
          [
            sequelize.fn("DATE_TRUNC", "month", sequelize.col("createdAt")),
            "ASC",
          ],
        ],
        transaction: t,
        raw: true,
      });

      const monthlyTrend = monthlyRaw.map((r) => {
        const anyR = r as any;
        return {
          month: moment(anyR.month, "YYYY-MM").format("MMM"),
          total: Number(anyR.total),
        };
      });

      const topSpendersRaw = await Expense.findAll({
        attributes: [
          "userId",
          [sequelize.fn("SUM", sequelize.col("amount")), "totalSpent"],
        ],
        include: [{ model: User, attributes: ["name"] }],
        group: ["userId", "user.id", "user.name"],
        order: [[sequelize.fn("SUM", sequelize.col("amount")), "DESC"]],
        limit: 5,
        transaction: t,
        raw: true,
        nest: true,
      });

      const topSpenders = topSpendersRaw.map((u) => {
        const anyU = u as any;
        const fullName: string = anyU.user.name;
        const initials = fullName
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase();

        const change = Math.floor(Math.random() * 41) - 20; // demo ±20%

        return {
          name: fullName,
          avatar: initials,
          totalSpent: Number(anyU.totalSpent),
          change,
        };
      });

      const recentActivities = allExpensesRaw.slice(0, 5).map((e) => {
        const ae = e as any;
        const action =
          ae.status === "Approved"
            ? "Approved"
            : ae.status === "Rejected"
            ? "Rejected"
            : "Submitted";

        return {
          action,
          description: `${ae.description} by ${ae.user.name}`, // ✅ Corrected field
          time: moment(ae.createdAt).fromNow(),
        };
      });

      const categoryDistribution = categoryDistRaw.map((r) => {
        const anyR = r as any;
        return { name: anyR.category, value: Number(anyR.value) };
      });

      const categoryStatus = statusDistRaw.map((r) => {
        const anyR = r as any;
        return { status: anyR.status, statusCount: Number(anyR.statusCount) };
      });

      res.status(StatusCodes.OK).json({
        status: "success",
        data: {
          totals: {
            totalExpenses,
            totalAmount,
            averageAmount,
            pendingApprovals,
          },
          categories: uniqueCategories,
          expenses: expensesList,
          categoryStatus,
          monthlyTrend,
          categoryDistribution,
          topSpenders,
          recentActivities,
        },
      });
    });
  }
);
