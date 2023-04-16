USE employees_db;

INSERT INTO department (title) VALUES 
('Engineering'),
('Finance'),
('Legal'),
('Sales'),

INSERT INTO roles (title, salary, department_id) VALUES
('Sales Lead', 100000, 4),
('Salesperson', 80000, 4),
('Lead Engineer', 150000, 1);
('Software Enginer', 120000, 1),
('Account Manager', 160000, 2),
('Accountant', 125000, 2),
('Legal Team Lead', 250000, 3),
('Lawyer', 190000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('Leonardo', 'DaVinci', 1)
('Mike', 'Chan', 2, 'Leonardo DaVinci'),
('Ashley', 'Rodriguez', 3),
('Kevin', 'Tupik', 4, 'Ashley Rodriguez'),
('Kunal', 'Singh', 5),
('Malia', 'Brown', 6, 'Kunal Singh'),
('Sarah', 'Lourd', 7),
('Tom', 'Allen', 8, 'Sarah Lourd');