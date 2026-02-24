"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Clocks", "status", {
      type: Sequelize.ENUM("open", "closed"),
      allowNull: false,
      defaultValue: "open",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Clocks", "status");
  },
};
