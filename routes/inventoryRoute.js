// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// New route to get vehicle details by ID
router.get("/detail/:id", invController.getVehicleDetail);

// Create a new route to trigger the 500 error
router.get("/trigger-error", (req, res) => {
    throw new Error("Intentional 500 Error");
});

router.post("/add", invController.addInventory);

router.get("/",invController.buildManagementView); 

module.exports = router;