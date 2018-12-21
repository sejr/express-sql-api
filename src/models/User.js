const db = require("../../db");
const Sequelize = require("sequelize");

const User = db.define("user", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  hashedPassword: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = User;