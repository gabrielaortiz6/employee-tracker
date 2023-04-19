const connection = require('./db/connection');
const consoleTable = require('console.table');
const inquirer = require('inquirer');

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

// function viewAllRoles() {
//   const query = `
//     SELECT 
//       roles.id, 
//       roles.title, 
//       roles.salary, 
//       department.title AS department 
//     FROM roles 
//     INNER JOIN department ON roles.department_id = department.id`;
//   connection.query(query, (err, res) => {
//     if (err) throw err;
//     console.table(res);
//     startApp();
//   });
// }

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
        type: "input",
        message: "Enter department ID: ",
        name: "department_id",
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
};

function addEmployee() {
  inquirer.prompt([
    {
      type: "input",
      message: "Enter the employee's first name:",
      name: "firstName"
    },
    {
      type: "input",
      message: "Enter the employee's last name:",
      name: "lastName"
    },
    {
      type: "list",
      message: "Select the employee's role:",
      name: "roleId",
    //   choices: async function () {
    //     await connection.query('SELECT * FROM roles', (err, res) => {
    //       if (err) throw err;
    //       return res.map(roles => ({ name: roles.title, value: roles.id }));
    //     });
    //   }
    // },
    choices: async function() {
      const [rows, fields] = await viewAllRoles();
      return rows.map(role => ({ name: role.title, value: role.id }));
    },
  },
    {
      type: "list",
      message: "Select the employee's manager:",
      name: "managerId",
      choices: async function() {
        const [rows, fields] = await viewAllEmployees();
        return rows.map(employee => ({ name: employee.first_name + " " + employee.last_name, value: employee.id }));
      }
    }
  ]).then(function (answer) {
    connection.query(
      "INSERT INTO employee SET ?",
      {
        first_name: answer.firstName,
        last_name: answer.lastName,
        roles_id: answer.roleId,
        manager_id: answer.managerId
      },
      function (err) {
        if (err) throw err;
        console.log("The employee was added successfully!");
        startApp();
      }
    );
  });
};

startApp();