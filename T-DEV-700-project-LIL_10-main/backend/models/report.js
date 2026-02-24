import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./user.js";
import Team from "./team.js";

const Report = sequelize.define(
  "Report",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    hours_worked: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  { tableName: "reports", timestamps: true },
);

Report.belongsTo(User, {
  foreignKey: {
    name: "user_id",
    type: DataTypes.UUID,
    allowNull: false,
  },
  as: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Report.belongsTo(Team, {
  foreignKey: {
    name: "team_id",
    type: DataTypes.UUID,
    allowNull: true,
  },
  as: "team",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});

User.hasMany(Report, { foreignKey: "user_id", as: "reports" });
Team.hasMany(Report, { foreignKey: "team_id", as: "teamReports" });

export default Report;
