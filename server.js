/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const session = require("express-session")
const pool = require('./database/')
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require('./routes/accountRoute.js');
const utilities = require("./utilities/");
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")


/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cookieParser())
app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // Layouts are in the layouts folder

/* ***********************
 * Routes
 *************************/
app.use(static);

/* ******************************************
 * Index Route
 ******************************************/
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inv", inventoryRoute);
// Account routes
app.use("/account", accountRoute);

// Intentional 500 Error Route (for testing)
app.get("/error", (req, res, next) => {
  const error = new Error("This is a simulated 500 error.");
  error.status = 500;
  next(error);
});

// File Not Found Route - must be last route in the list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
 * Error Handling Middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  
  if (err.status === 500) {
    // Rendering the 500 error view
    res.status(500).render("errors/500", {
      title: "Server Error",
      message: "Oh no! Something went wrong on our end.",
      error: err, // Include error for debugging
      nav
    });
  } else {
    // Default error handling for other errors like 404
    const message = err.status == 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?';
    res.status(err.status || 500).render("errors/error", {
      title: err.status || 'Server Error',
      message,
      nav
    });
  }
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});
