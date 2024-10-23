// Needed Resources
const express = require("express");
const router = new express.Router();

const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Route to deliver account management view (uncomment if needed)
router.get("/", utilities.checkLogin,utilities.checkAuthorizationManager, utilities.handleErrors(accountController.buildAccountManagementView));

// Route to deliver the login view
router.get("/login", utilities.handleErrors(accountController.buildLogin)); // Added login route

// Route to logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// Route to deliver the registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistration)); // Added registration route

// Route to handle account registration with validation
router.post(
  "/register",
  regValidate.registrationRules(), // Corrected function name
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request with validation and error handling
router.post(
  "/login",
  regValidate.loginRules(),            // Login validation rules
  regValidate.checkLoginData,          // Function to check login data
  utilities.handleErrors(accountController.accountLogin) // Controller function to process login
);

// Update account handlers
router.get("/update/:accountId", utilities.handleErrors(accountController.buildUpdate));
router.post(
  "/update",
  regValidate.updateRules(), // TODO: This needs to have a separate rule set, without existing email check..unless...oh complex
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
  );
router.post(
  "/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;
