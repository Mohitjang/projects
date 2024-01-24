const User = require("../models/user");
const { get } = require("../routes/auth");
const validation = require("../util/validation");
const validationSession = require("../util/validation-session");

function get401(req, res) {
  res.status(401).render("401");
}

function getSignup(req, res) {
  // using session-validation:-
  let sessionInputData = validationSession.getSessionErrorData(req, {
    email: "",
    confirmEmail: "",
    password: "",
  });

  res.render("signup", {
    inputData: sessionInputData,
    csrfToken: req.csrfToken(),
  });
}

function getLogin(req, res) {
  // using session-validation:-
  let sessionInputData = validationSession.getSessionErrorData(req, {
    email: "",
    password: "",
  });

  res.render("login", {
    inputData: sessionInputData,
    csrfToken: req.csrfToken(),
  });
}

async function signup(req, res) {
  const userData = req.body;
  const enteredEmail = userData.email; // userData['email']
  const enteredConfirmEmail = userData["confirm-email"];
  const enteredPassword = userData.password;
  const newUser = new User(enteredEmail, enteredPassword);

  if (
    !validation.userDetailsAreValid(
      enteredEmail,
      enteredConfirmEmail,
      enteredPassword
    )
  ) {
    // using session-validation:-
    validationSession.flashErrorsToSession(
      req,
      {
        message: "Invalid input - please check your data.",
        email: enteredEmail,
        confirmEmail: enteredConfirmEmail,
        password: enteredPassword,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }
  // using models:-
  const userExistsAlready = await newUser.existsAlready();
  if (userExistsAlready) {
    // using session-validation:-
    validationSession.flashErrorsToSession(
      req,
      {
        message: "Invalid input - user already exists!",
        email: enteredEmail,
        confirmEmail: enteredConfirmEmail,
        password: enteredPassword,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }
  // using models:-
  await newUser.signUp();

  res.redirect("/login");
}

async function login(req, res) {
  const userData = req.body;
  const enteredEmail = userData.email;
  const enteredPassword = userData.password;
  const newUser = new User(enteredEmail, enteredPassword);

  // using models:-
  const existingUser = await newUser.getUserWithSameEmail();
  if (!existingUser) {
    // using util session-validation:-
    validationSession.flashErrorsToSession(
      req,
      {
        message: "Could not log you in - please check your credentials!",
        email: enteredEmail,
        password: enteredPassword,
      },
      function () {
        res.redirect("/login");
      }
    );
    return;
  }
  const passwordsAreEqual = await newUser.login(existingUser.password);
  if (!passwordsAreEqual) {
    validationSession.flashErrorsToSession(
      req,
      {
        message: "Could not log you in - please check your credentials!",
        email: enteredEmail,
        password: enteredPassword,
      },
      function () {
        res.redirect("/login");
      }
    );
    return;
  }

  // using util session-validation:-
  validationSession.setSessionLoginData(req, existingUser, function () {
    res.redirect("/admin");
  });
}

function logout(req, res) {
  // using util session-validation:-
  validationSession.removeSessionLoginData(req);
  res.redirect("/");
}
module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
  get401: get401,
};
