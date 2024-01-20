const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../data/database");

const router = express.Router();

router.get("/", function (req, res) {
  res.render("welcome");
});

router.get("/signup", function (req, res) {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: "",
      confirmEmail: "",
      password: "",
    };
  }

  // clearing the session data:-
  req.session.inputData = null;

  res.render("signup", { inputData: sessionInputData });
});

router.get("/login", function (req, res) {
  let sessionInputData = req.session.inputData;

  if (!sessionInputData) {
    sessionInputData = {
      hasError: false,
      email: "",
      password: "",
    };
  }
  // clearing the session data:-
  req.session.inputData = null;

  res.render("login", { inputData: sessionInputData });
});

router.post("/signup", async function (req, res) {
  const userData = req.body;
  const enteredEmail = userData.email.trim(); // userData['email']
  const enteredConfirmEmail = userData["confirm-email"].trim();
  const enteredPassword = userData.password;

  // validations:-
  // blank_email OR blank_confirmEmail OR blank_password OR entered_email !== entered_confirm_email OR password length < 6 OR email includes '@'
  if (
    !enteredEmail ||
    !enteredConfirmEmail ||
    !enteredPassword ||
    enteredEmail !== enteredConfirmEmail ||
    enteredPassword.length < 6 ||
    !enteredEmail.includes("@")
  ) {
    console.log("invalid details! - Enter valid information");
    req.session.inputData = {
      hasError: true,
      message: "Invalid input - Please check your data.",
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
    };

    req.session.save(function () {
      res.redirect("/signup");
    });
    return;
  }

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: enteredEmail });

  // check is email is exist in db
  if (existingUser) {
    console.log("user already exists! - Try with other username");
    req.session.inputData = {
      hasError: true,
      message: "User already exists!",
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
    };

    req.session.save(function () {
      res.redirect("/signup");
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(enteredPassword, 12);

  const user = {
    email: enteredEmail,
    password: hashedPassword,
  };

  await db.getDb().collection("users").insertOne(user);

  res.redirect("/login");
});

router.post("/login", async function (req, res) {
  const enteredEmail = req.body.email;
  const enteredPassword = req.body.password;

  const existingUser = await db
    .getDb()
    .collection("users")
    .findOne({ email: enteredEmail });

  // if user does not exist:-
  if (!existingUser) {
    console.log("Login failed! - user does not exist! login again...");
    req.session.inputData = {
      hasError: true,
      message: "Could not log you in - Please check your credentials!.",
      email: enteredEmail,
      password: enteredPassword,
    };

    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }
  // comaparing the passwords :-
  const passwordsAreEqual = await bcrypt.compare(
    enteredPassword,
    existingUser.password
  );

  // if password is not matching :-
  if (!passwordsAreEqual) {
    console.log("Login failed! - Wrong Password! login again...");
    req.session.inputData = {
      hasError: true,
      message: "Could not log you in - Please check your credentials!.",
      email: enteredEmail,
      password: enteredPassword,
    };
    req.session.save(function () {
      res.redirect("/login");
    });
    return;
  }

  // in this when user is logging in - we save the user data in the sessions:-
  // add user data to session that which user is authenticated:-
  req.session.user = {
    id: existingUser._id,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin, //if we want to session storage for checking isAdmin
  };
  req.session.isAuthenticated = true;
  req.session.save(function () {
    res.redirect("/profile");
    console.log("user is Authenticated!");
  });
});

router.get("/admin", async function (req, res) {
  // because this page is protected we have check that ,
  // - is user is available in the sessions or not if not then don't allow to proceed:-
  // check the user ticket:-
  if (!req.session.isAuthenticated) {
    return res.status(401).render("401");
  }

  // if we had stored isAdmin flag in session storage then we would have need this.
  if (!req.session.user.isAdmin) {
    return res.status(403).render("403");
  }

  // const user = await db
  //   .getDb()
  //   .collection("users")
  //   .findOne({ _id: req.session.user.id });

  // if (!user || !user.isAdmin) {
  //   return res.status(403).render("403");
  // }

  res.render("admin");
});

router.get("/profile", function (req, res) {
  if (!req.session.isAuthenticated) {
    return res.status(401).render("401");
  }

  res.render("profile");
});

router.post("/logout", function (req, res) {
  // req.session.destroy();
  req.session.user = null;
  req.session.isAuthenticated = false;
  res.redirect("/");
});

module.exports = router;
