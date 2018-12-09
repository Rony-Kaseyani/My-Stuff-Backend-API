// Dependencies
const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const passport = require("passport");
const logger = require("morgan");
const methodOverride = require("method-override");
const errorhandler = require("errorhandler");
const models = require("./models");
const session = require("express-session");
const validator = require("express-validator");

// init express app
const app = express();

const isProduction = process.env.NODE_ENV === "production";

app.use(express.static("public"));
app.use(express.static("views"));

/// express config
app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(validator());
app.use(methodOverride());

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(async (req, res, next) => {
  // checking whether user is admin
  app.locals.admin_user = req.user && req.user.is_admin;
  // checking whether user is logged out
  app.locals.logged_out = !req.isAuthenticated();
  // checking whether user is logged in
  app.locals.logged_in = req.isAuthenticated();
  // retrieving all articles pinned by the admin
  app.locals.pinned_articles = await models.News.findAll({
    where: { approved: true, pinned: true }
  });
  // retrieving all categories to be used in our views to display navigation etc.
  app.locals.categories = await models.Category.findAll();
  next();
});
app.use(require("./routes"));

//load passport strategies
require("./config/passport/passport.js")(passport, models.user);

if (!isProduction) {
  app.use(errorhandler());
}

/// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error("The requested page could not be found.");
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req, res, next) => {
    console.log(err.stack);

    res.status(err.status || 500);

    res.render("error", {
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to the client
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error", {
    errors: {
      message: err.message,
      error: {}
    }
  });
});

module.exports = app;
