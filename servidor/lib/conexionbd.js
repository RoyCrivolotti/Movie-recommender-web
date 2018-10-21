var mysql = require('mysql');
require('dotenv').config();

console.log({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '3306',
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

var connection = mysql.createConnection({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || '3306',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect();
module.exports = connection;