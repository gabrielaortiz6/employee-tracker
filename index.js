const connection = require('./db/connection');
const consoleTable = require('console.table');
const inquirer = require('inquirer');

function startApp() {
  inquirer
    .prompt({
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add A Department',
        'Add A Role',
        'Add An Employee',
        'Update An Employee Role',
        'Exit'
      ]
    })
    .then(answer => {
      switch (answer.choice) {
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'View All Employees':
          viewAllEmployees();
          break;
        case 'Add A Department':
          addDepartment();
          break;
        // case 'Add A Role':
        //   addRole();
        //   break;
        // case 'Add An Employee':
        //   addEmployee();
        //   break;
        // case 'Update An Employee Role':
        //   updateEmployeeRole();
        //   break;
        case 'Exit':
          connection.end();
          break;
      }
    });
}

function viewAllDepartments() {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function viewAllRoles() {
  const query = `
    SELECT 
      roles.id, 
      roles.title, 
      roles.salary, 
      department.title AS department 
    FROM roles 
    LEFT JOIN department ON roles.department_id = department.id`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function viewAllEmployees() {
  const query = `
    SELECT 
      employee.id, 
      employee.first_name, 
      employee.last_name, 
      roles.title AS title, 
      department.title AS department, 
      roles.salary AS salary, 
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    FROM employee 
    LEFT JOIN roles ON employee.roles_id = roles.id 
    LEFT JOIN department ON roles.department_id = department.id 
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
}

function addDepartment() {
  inquirer
    .prompt({
      type: 'input',
      name: 'name',
      message: 'What is the name of the department?'
    })
    .then(answer => {
      connection.query(
        'INSERT INTO department SET ?',
        { title: answer.name },
        err => {
          if (err) throw err;
          console.log('Department added!');
          startApp();
        }
      );
    });
}

startApp();