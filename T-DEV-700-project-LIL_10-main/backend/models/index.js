// models/index.js
import { Sequelize } from "sequelize";
import { UserModel } from "./User.js";

import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
);

const User = UserModel(sequelize);
const Task = TaskModel(sequelize);

export { sequelize, User, Task };
