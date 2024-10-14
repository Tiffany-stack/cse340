const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
 *  Get vehicle detail by vehicle ID
 * ************************** */
invCont.getVehicleDetail = async function (req, res, next) {
  try {
    const vehicleId = req.params.id;
    const vehicle = await invModel.getInventoryByInventoryId(vehicleId); // Use the correct function

    // Check if vehicle exists
    if (!vehicle || vehicle.length === 0) {
      let nav = await utilities.getNav(); // Ensure nav is included
      res.status(404).render('errors/404', { 
        title: 'Vehicle Not Found', 
        message: `No vehicle with ID: ${vehicleId} found.`,
        nav 
      });
      return;
    }

    const vehicleData = vehicle[0]; // Extract the first item from the result
    let nav = await utilities.getNav();

    // Render the detail view
    res.render("./inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`, // Set the title based on vehicle details
      nav,
      vehicle: vehicleData, // Pass the vehicle data to the view
    });
  } catch (error) {
    next(error);
  }
}





/* ***************************
 *  Add inventory item (POST)
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    
    // Add inventory item into the database
    const result = await invModel.addNewInventory({
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    })

    if (result) {
      res.redirect('/inv') // Redirect to inventory list after successful addition
    } else {
      let nav = await utilities.getNav()
      res.render('inventory/addInventory', {
        title: 'Add Inventory',
        nav,
        errors: [{ msg: 'Failed to add inventory item.' }],
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
      })
    }
  } catch (error) {
    next(error)
  }
}

module.exports = invCont