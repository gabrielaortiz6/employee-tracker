# Employee Tracker

## Descripton

This is a command line application that is in charge of creating an interface called a content management system (CMS). This CMS will allow non-developers to easily view and manipulate an employee database. You can view by department, roles, or employees, as well as add to each respectively. You can also update an employee's role in the instance they get a promotion. This application uses Node.js, Inquirer, and MySQL. 

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Installation 

Git clone from Github and initiate with node index.

## Mock-Up

The following video and shows the web application's appearance and functionality:

![Screenrecording of Functionality](https://drive.google.com/file/d/1avC8-09IxJBY1t3Eh5Bo8DVRcAPHdDHR/view?pli=1)

## Link to GitHub Repo
[GitHub Repo](https://github.com/gabrielaortiz6/employee-tracker)

