const path = require("path");

const express = require("express");
// for session:-
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session");

const db = require("./data/database");
const demoRoutes = require("./routes/demo");

// connecting session to mongodb store:-
const MongoDBStore = mongodbStore(session);

const app = express();

// creating session store object using some parameters:-
const sessionStore = new MongoDBStore({
  uri: "mongodb://localhost:27017", // locally running mongodb database.
  databaseName: "auth-demo",
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// middle ware for session-cookies:-
app.use(
  session({
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore, // it sets where the session data would be store.
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
  })
);

// custom middleware for all the common pages:-
app.use(async function (error, req, res, next) {
  const user = req.session.user;
  const isAuth = req.session.isAuthenticated;

  // if we dont have user details in session :-
  if (!user || !isAuth) {
    return next();
  }
  console.log(user);
  console.log(isAuth);

  const userDoc = await db
    .getDb()
    .collection("users")
    .findOne({ _id: user.id });
  const isAdmin = userDoc.isAdmin;
  
  // to allow vars at global level:-
  res.locals.isAuth = isAuth;
  res.locals.isAdmin = isAdmin;
  next(); 
}); 

app.use(demoRoutes);

app.use(function (error, req, res, next) {
  res.render("500");
});

db.connectToDatabase().then(function () {
  app.listen(3000);
});
