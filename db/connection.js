const mysql = require('mysql2');

// create the connection to the database
const connection = mysql.createConnection(
    {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'employees_db'
},
console.log(`Connected to the employees_db database`)
);

module.exports = connection;