// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// Public Routes (No Authorization Needed)
// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId))

// Route for error handling (public)
router.get("/error", utilities.handleErrors(invController.buildError))

// Route to get inventory data as JSON (public)
router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
)

// Restricted Routes (Require Authorization)
// All routes below require either "Employee" or "Admin" account type

// Inventory management view (admin only)
router.get(
    "/", 
    utilities.checkAuthorizationManager,  // Authorization middleware
    utilities.handleErrors(invController.buildManagement)
)

// Routes to add classification and inventory (admin only)
router.get(
    "/add-classification", 
    utilities.checkAuthorizationManager,  // Authorization middleware
    utilities.handleErrors(invController.buildAddView)
)
router.get(
    "/add-inventory", 
    utilities.checkAuthorizationManager,  // Authorization middleware
    utilities.handleErrors(invController.buildAddInv)
)
router.post(
    "/add-classification", 
    utilities.checkAuthorizationManager,  // Authorization middleware
    invValidate.classificationRules(), 
    invValidate.checkClassificationData, 
    utilities.handleErrors(invController.addClassification)
)
router.post(
    "/add-inventory",
    utilities.checkAuthorizationManager,  // Authorization middleware
    invValidate.inventoryRules(), 
    invValidate.checkInventoryData, 
    utilities.handleErrors(invController.addInventory)
)

// Routes to edit/update inventory (admin only)
router.get(
    "/edit/:inventoryId", 
    utilities.checkAuthorizationManager,  // Authorization middleware
    utilities.handleErrors(invController.buildEditInventory)
)
router.post(
    "/update/", 
    utilities.checkAuthorizationManager,  // Authorization middleware
    invValidate.inventoryRules(), 
    invValidate.checkUpdateData, 
    utilities.handleErrors(invController.updateInventory)
)

// Routes to delete vehicle information (admin only)
router.get(
    "/delete/:inventoryId", 
    utilities.checkAuthorizationManager,  // Authorization middleware
    utilities.handleErrors(invController.buildDeleteInventory)
)
router.post(
    "/delete/", 
    utilities.checkAuthorizationManager,  // Authorization middleware
    utilities.handleErrors(invController.deleteInventory)
)

module.exports = router
