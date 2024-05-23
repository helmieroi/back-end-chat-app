const mysql = require('mysql');

const pool  = mysql.createConnection({
    user: 'phpmyadmin',
    host: 'localhost',
    database: 'chat_db',
    password: 'root',
    port: 3306,
  });

  module.exports = pool; 