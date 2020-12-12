const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employees = [];

const startQuestions = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the team member?",
      },

      {
        type: "input",
        name: "id",
        message: "What is the id of the team member?",
      },
      {
        type: "input",
        name: "email",
        message: "What is your email address?",
      },

      {
        type: "list",
        name: "role",
        message: "Choose a role.",
        choices: ["Engineer", "Intern", "Manager"],
      },
      {
        type: "input",
        name: "github",
        message: "Engineer please enter your github username.",
        when: (response) => response.role === "Engineer",
      },
      {
        type: "input",
        name: "school",
        message: "Intern plese enter your school.",
        when: (response) => response.role === "Intern",
      },
      {
        type: "input",
        name: "officeNumber",
        message: "Manager, please enter office number.",
        when: (response) => response.role === "Manager",
      },
      {
        type: "list",
        name: "continue",
        message: "Do you want to continue with more team members?",
        choices: ["Yes", "No"],
      },
    ])

    .then((results) => {
      
      if (results.role === "Engineer") {
        const engineer = new Engineer(

          results.name,
          results.id,
          results.email,
          results.github

        );
        employees.push(engineer);
      } else if (results.role === "Intern") {
        const intern = new Intern(

          results.name,
          results.id,
          results.email,
          results.school

        );
        employees.push(intern);
      } else {
        const manager = new Manager(

          results.name,
          results.id,
          results.email,
          results.officeNumber

        );

        employees.push(manager);

      }
      if (results.continue === "Yes") {

        startQuestions();

      } else {

        const html = render(employees);
        writeFileAsync(outputPath, html).then(() => {
     
        });
      }
    });
};
startQuestions();

