const connection = require('./db/connection');
const consoleTable = require('console.table');
const inquirer = require('inquirer');

require('events').EventEmitter.defaultMaxListeners = 15;
const readline = require('readline');

const promiseConnection = connection.promise();

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
        case 'Add A Role':
          addRoles();
          break;
        case 'Add An Employee':
          addEmployee();
          break;
        case 'Update An Employee Role':
          updateEmployeeRole();
          break;
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
    INNER JOIN department ON roles.department_id = department.id`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    startApp();
  });
  return promiseConnection.query(query);
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
  return promiseConnection.query(query);
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
};

function addRoles() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;

  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter role title: ",
        name: "title",
      },
      {
        type: "input",
        message: "Enter salary: ",
        name: "salary",
      },
      {
        type: "list",
        message: "Enter department ID: ",
        name: "department_id",
        choices: res.map((department) => ({
          name: department.title,
          value: department.id,
        })),
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO roles SET ?",
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id,
        },
        (err, res) => {
          if (err) throw err;
          console.log(res.affectedRows + " role added!\n");
          startApp();
        }
        );
      });
  });
}

function addEmployee() {
  let answers = {};

    inquirer
    .prompt({
        type: "input",
        message: "Enter the employee's first name:",
        name: "firstName"
      })
      .then((answer) => {
        answers.firstName = answer.firstName;
        return inquirer.prompt({
          type: "input",
          message: "Enter the employee's last name:",
          name: "lastName"
        });
      })
      .then((answer) => {
        answers.lastName = answer.lastName;
        connection.query(`SELECT * FROM roles`, (err, roles) => {
          if (err) throw err;

         return inquirer
         .prompt([
          {
          type: "list",
          message: "Select the employee's role:",
          name: "roleId",
          choices: roles.map((role) => ({
            name: role.title,
            value: role.id,
          })),
        },
      ])
      .then((answer) => {
        answers.roleId = answer.roleId;
        connection.query(`SELECT * FROM employee`, (err, employees) => {
        if (err) throw err;

         return inquirer
         .prompt([
          {
          type: "list",
          message: "Select the employee's manager:",
          name: "managerId",
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
      ])
      .then((answer) => {
        answers.managerId = answer.managerId;
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: answers.firstName,
            last_name: answers.lastName,
            roles_id: answers.roleId,
            manager_id: answers.managerId
          },
          function (err) {
            if (err) throw err;
            console.log("The employee was added successfully!");
            startApp();
          }
        );
      });
    });
  });
})
}
    )}

function updateEmployeeRole() {
connection.query(`SELECT * FROM employee`, (err, employees) => {
  if (err) throw err;

  inquirer
    .prompt([
      {
        type: "list",
        message: "Select the employee to update:",
        name: "employeeId",
        choices: employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
      },
    ])
    .then((employeeAnswer) => {
      connection.query(`SELECT * FROM roles`, (err, roles) => {
        if (err) throw err;

        inquirer
          .prompt([
            {
              type: "list",
              message: "Select the employee's new role:",
              name: "updateRoleId",
              choices: roles.map((role) => ({
                name: role.title,
                value: role.id,
              })),
            },
          ])
          .then((roleAnswer) => {
            connection.query(
              `UPDATE employee SET roles_id = ? WHERE id = ?`,
              [roleAnswer.updateRoleId, employeeAnswer.employeeId],
              (err) => {
                if (err) throw err;
                console.log("Employee role updated!");
                startApp();
              }
            );
          });
      });
    });
});
}

startApp();