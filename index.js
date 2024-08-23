const inquirer = require('inquirer');
const {
    getDepartments,
    getRoles,
    getEmployees,
    addDepartment,
    addRole,
    addEmployee,
    updateEmployeeRole,
} = require('./db/queries');

const mainMenu = async () => {
    const { choice } = await inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        }
    ]);

    switch (choice) {
        case 'View all departments':
            const departments = await getDepartments();
            console.table(departments);
            break;
        case 'View all roles':
            const roles = await getRoles();
            console.table(roles);
            break;
        case 'View all employees':
            const employees = await getEmployees();
            console.table(employees);
            break;
        case 'Add a department':
            await promptAddDepartment();
            break;
        case 'Add a role':
            await promptAddRole();
            break;
        case 'Add an employee':
            await promptAddEmployee();
            break;
        case 'Update an employee role':
            await promptUpdateEmployeeRole();
            break;
        case 'Exit':
            console.log('Goodbye!');
            process.exit();
    }

    mainMenu();
};

const promptAddDepartment = async () => {
    const { name } = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the department:',
        },
    ]);

    const newDepartment = await addDepartment(name);
    console.log(`Added department: ${newDepartment.name}`);
};

const promptAddRole = async () => {
    const departments = await getDepartments();
    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id,
    }));

    const { title, salary, department_id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role:',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for the role:',
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Select the department for the role:',
            choices: departmentChoices,
        },
    ]);

    const newRole = await addRole(title, salary, department_id);
    console.log(`Added role: ${newRole.title}`);
};

const promptAddEmployee = async () => {
    const roles = await getRoles();
    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id,
    }));

    const employees = await getEmployees();
    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
    }));
    managerChoices.unshift({ name: 'None', value: null });

    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the employee\'s first name:',
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the employee\'s last name:',
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Select the employee\'s role:',
            choices: roleChoices,
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Select the employee\'s manager:',
            choices: managerChoices,
        },
    ]);

    const newEmployee = await addEmployee(first_name, last_name, role_id, manager_id);
    console.log(`Added employee: ${newEmployee.first_name} ${newEmployee.last_name}`);
};

const promptUpdateEmployeeRole = async () => {
    const employees = await getEmployees();
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id,
    }));

    const roles = await getRoles();
    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id,
    }));

    const { employee_id, new_role_id } = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Select the employee to update:',
            choices: employeeChoices,
        },
        {
            type: 'list',
            name: 'new_role_id',
            message: 'Select the employee\'s new role:',
            choices: roleChoices,
        },
    ]);

    const updatedEmployee = await updateEmployeeRole(employee_id, new_role_id);
    console.log(`Updated employee: ${updatedEmployee.first_name} ${updatedEmployee.last_name}'s role to ${roles.find(role => role.id === new_role_id).title}`);
};

mainMenu();
