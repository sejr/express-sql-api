require("dotenv").config();
const Sequelize = require("sequelize");

// Other database types are available.
// See http://docs.sequelizejs.com/manual/installation/usage.html
const dialect = "postgres";

// Database info.
const credentials = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
};

// Connect to db.
const db = new Sequelize({ dialect, ...credentials });

module.exports = db;