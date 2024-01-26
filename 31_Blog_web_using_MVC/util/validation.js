const bcrypt = require("bcryptjs");

function postIsValid(title, content) {
  return title && content && title.trim() !== "" && content.trim() !== "";
}

// async function checkPassword(password, existingUserPassword) {
//   const passwordsAreEqual = await bcrypt.compare(
//     password,
//     existingUserPassword
//   );
//   return passwordsAreEqual;
// }

function userDetailsAreValid(email, confirmEmail, password) {
  return (
    email ||
    confirmEmail ||
    password ||
    password.trim().length < 6 ||
    email !== confirmEmail ||
    email.includes("@")
  );
}

module.exports = {
  postIsValid: postIsValid,
  // checkPassword: checkPassword,
  userDetailsAreValid: userDetailsAreValid,
};
