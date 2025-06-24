#  Expense Tracker Backend (Node.js + TypeScript + Sequelize + Supabase)

This is the backend REST API for an Expense Tracker app built with **Express**, **TypeScript**, **Sequelize**, and a **Supabase-hosted PostgreSQL** database. It features secure user authentication, role-based access, and real-time expense tracking logic.

---

##  Features

-  User registration and login with hashed passwords (bcrypt)
-  Role-based access: Admin and Employee
-  Create Expense
-  Get expenses with filters (date/category)
-  Approve/Reject expenses (admin only)
-  Analytics (total expenses by category)
-  Middleware-based access control
-  PostgreSQL with Sequelize ORM
-  Seed data for quick testing
-  Written fully in `.ts` files with `nodemon` + `ts-node` runner

---

##  Installation

### Prerequisites

- Node.js ≥ 16.x
- pnpm installed globally:  
  ```bash
  npm install -g pnpm
  pnpm install nodemon -g 
### Start server

nodemon server.ts