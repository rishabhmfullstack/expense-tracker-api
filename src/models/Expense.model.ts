import {
  Column,
  DataType,
  Model,
  Table,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { sequelize } from "../config/sequelize";
import { User } from "./User.model";
import {
  Category,
  ExpenseCreationAttributes,
  Status,
} from "../../utils/interface";

@Table({
  tableName: "expenses",
  timestamps: true,
})
export class Expense extends Model<Expense, ExpenseCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  declare amount: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(Category)))
  declare category: Category;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare description: string;

  @Default(Status.PENDING)
  @Column(DataType.ENUM(...Object.values(Status)))
  declare status: Status | null;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare userId: string;

  @BelongsTo(() => User)
  declare user: User;
}

// Register the model
sequelize.addModels([Expense]);
