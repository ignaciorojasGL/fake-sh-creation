const axios = require("axios");
const faker = require("faker");

const apiUrl = "https://dev-api.astrella.com/api/";

const myArgs = process.argv.slice(2);
console.log("myArgs: ", myArgs);

const consoleEmail = myArgs
  .find(arg => -1 !== arg.indexOf("email="))
  .split("email=")[1];
const consolePass = myArgs
  .find(arg => -1 !== arg.indexOf("pass="))
  .split("pass=")[1];
const consoleAsOfDate = myArgs
  .find(arg => -1 !== arg.indexOf("asOfDate="))
  .split("asOfDate=")[1];
const consoleDomain = myArgs
  .find(arg => -1 !== arg.indexOf("domain="))
  .split("domain=")[1];
const consoleStakeholderCount = myArgs
  .find(arg => -1 !== arg.indexOf("stakeholderCount="))
  .split("stakeholderCount=")[1];
const consoleCodePrefix = myArgs
  .find(arg => -1 !== arg.indexOf("codePrefix="))
  .split("codePrefix=")[1];

console.log("Email:", consoleEmail);
console.log("Pass:", consolePass);
console.log("AsOfDate:", consoleAsOfDate);
console.log("Domain:", consoleDomain);
console.log("StakeholderCount:", consoleStakeholderCount);
console.log("CodePrefix:", consoleCodePrefix);

const generateFakeStakeholderData = (domain, code) => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = (firstName[0] + lastName + "@" + domain).toLowerCase();
  const type = "Employee";
  const role = "Stakeholder";
  const asOfDate = consoleAsOfDate;
  return {
    Email: email,
    AsOfDate: asOfDate,
    Type: type,
    Role: role,
    Code: code,
    FirstName: firstName,
    MiddleName: "",
    LastName: lastName,
    Prefix: "",
    Suffix: "",
    NickName: ""
  };
};

let authToken = "";
console.log("Trying to login");

axios
  .post(`${apiUrl}Account/Login`, {
    UserName: consoleEmail,
    Password: consolePass
  })
  .then(response => {
    authToken = response.data.token;
    console.log(`WELCOME: ${response.data.fullName}!!!`);

    for (let i = 0; i < consoleStakeholderCount; i++) {
      const newStakeholder = generateFakeStakeholderData(
        consoleDomain,
        consoleCodePrefix + "" + i
      );

      axios
        .post(`${apiUrl}Stakeholder`, newStakeholder, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken
          }
        })
        .then(response => {
          console.log(
            newStakeholder.FirstName + " " + newStakeholder.LastName + "Created"
          );
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  })
  .catch(error => {
    console.log(error.response);
  });
