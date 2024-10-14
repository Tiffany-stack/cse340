// Needed Resources
const express = require("express");
const router = new express.Router();

const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Route to deliver account management view (already present)
///router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagementView));

// Route to deliver the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin)); // Added login route

// Route to deliver the registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistration)); // Added registration route
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Route to handle account registration
router.post('/register', utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router;
