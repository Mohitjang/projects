// importing built-in packages:-
const path = require("path");

// importing third-party packages:-
const express = require("express");
const csrf = require("csurf");
const session = require("express-session");

// importing other files from other folders:-
const sessionConfig = require("./config/session");
const db = require("./data/database");
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");
const authMidWare = require("./middlewares/auth-middleware");

// initializing objects:-
const mongoDbSessionStore = sessionConfig.createSessionStore(session);
const app = express();

// setting public folders and ejs templates:-
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middlewares:-
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(session(sessionConfig.createSessionConfig(mongoDbSessionStore)));
app.use(csrf());

app.use(authMidWare.auth);

app.use(authRoutes);
app.use(blogRoutes);

app.use(function (error, req, res, next) {
  res.render("500", {
    csrfToken: req.csrfToken(),
  });
});

db.connectToDatabase().then(function () {
  app.listen(3000);
});
