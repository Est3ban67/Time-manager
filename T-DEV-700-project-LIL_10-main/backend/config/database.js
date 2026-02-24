import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  },
);

try {
  await sequelize.authenticate();
  console.log("Connected to PostgreSQL successfully!");
} catch (error) {
  console.error("Unable to connect to PostgreSQL:", error);
}

export { sequelize };
export default sequelize;
