import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Clock = sequelize.define(
  "Clock",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    checkInMorning: {
      type: DataTypes.TIME,
      allowNull: true,
    },

    checkOutMorning: {
      type: DataTypes.TIME,
      allowNull: true,
    },

    checkInAfterNoon: {
      type: DataTypes.TIME,
      allowNull: true,
    },

    checkOutAfterNoon: {
      type: DataTypes.TIME,
      allowNull: true,
    },

    checkIn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Clocks",
    timestamps: true,
  },
);

Clock.belongsTo(User, { foreignKey: "userId", as: "User" });

export default Clock;
