import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  AllowNull,
} from "sequelize-typescript";
import { sequelize } from "../config/sequelize";

export enum Role {
  EMPLOYEE = "Employee",
  ADMIN = "Admin",
}

@Table({ tableName: "users" })
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare password: string;

  @Default(Role.ADMIN)
  @Column(DataType.ENUM(...Object.values(Role)))
  declare role: string;
  
}

sequelize.addModels([User]);
