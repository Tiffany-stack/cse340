// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId))
router.get("/error", utilities.handleErrors(invController.buildError))
router.get("/", utilities.handleErrors(invController.buildManagement))
router.get("/add-classification", utilities.handleErrors(invController.buildAddView))
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInv))

// POST routes to add classification and inventory
router.post(
    "/add-classification", 
    invValidate.classificationRules(), // Correct function name
    invValidate.checkClassificationData, // Correct function name
    utilities.handleErrors(invController.addClassification)
)

router.post(
    "/add-inventory",
    invValidate.inventoryRules(), // Correct function name
    invValidate.checkInventoryData, // Correct function name
    utilities.handleErrors(invController.addInventory)
)

// Route to return inventory data as JSON
router.get(
    "/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON)
)

module.exports = router
