const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
	host: process.env.HOST || 'localhost',
	port: process.env.PORT || '3306',
	user: process.env.DB_USER || 'root',
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
});

connection.connect();

module.exports = connection;
