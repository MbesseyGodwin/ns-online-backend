const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

var connection = mysql.createPool({
  port: dbConfig.PORT,
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

module.exports = connection;
