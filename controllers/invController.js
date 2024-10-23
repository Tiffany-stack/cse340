const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
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
}

/* ***************************
 *  Build details by vehicleDetails view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInventoryId(inv_id)
  const vehicle = data[0]
  const content = await utilities.buildDetailView(vehicle)
  let nav = await utilities.getNav()
  const vehicleName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    vehicle,  // Pass vehicle object directly
  })
}

invCont.buildError = async function (req, res, next) {
  const inv_id = 100
  const data = await invModel.getInventoryByInvId(inv_id)
  const vehicle = data[0]
  const content = await utilities.buildInventoryDetails(vehicle)
  let nav = await utilities.getNav()
  const vehicleName = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
  res.render("./inventory/vehicleDetails", {
    title: vehicleName,
    nav,
    content
  })
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: [],  // Initialize as an empty array for consistency
    classificationSelect
  })
}


invCont.buildAddView = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/addClassification", {
    nav,
    title: "Add New Classification",
    errors: null
  })
}

invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  
  let addResult = await invModel.addClassification(classification_name)
  nav = await utilities.getNav()
  
  if (addResult) {
    req.flash(
      "notice",
      `You have added a new classification ${classification_name}`
    )

    res.status(201).render("./inventory/management", {
      nav,
      title: "Vehicle Management",
      errors: null
    })
  } else {
    req.flash("notice", "Adding classification failed.")
    res.status(501).render("./inventory/addClassification", {
      nav,
      title: "Add Classification",
      errors: null,
    })
  }
}

invCont.buildAddInv = async function(req, res, next) {
  let nav = await utilities.getNav()
  let classificationNames = await utilities.buildClassificationList()
  res.render("./inventory/addInventory", {
    nav,
    title: "Add New Vehicle",
    classifications: classificationNames, // Pass as 'classifications'
    errors: []  // Initialize as an empty array
  })
}

invCont.addInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  const {
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
  } = req.body
  const vehicle = `${inv_year} ${inv_make} ${inv_model}`
  
  let addResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
  let classificationNames = utilities.buildClassificationList(classification_id)
  
  if (addResult) {
    req.flash("notice", `${vehicle} has been added to the inventory`)
    res.status(201).render("./inventory/management", {
      nav,
      title: "Vehicle Management",
      errors: [],  // Initialize as an empty array
    })
  } else {
    req.flash("notice", "Adding vehicle failed")
    res.status(501).render("./inventory/addInventory", {
      nav,
      title: "Add New Vehicle",
      classifications: classificationNames,
      errors: [],  // Initialize as an empty array
    })
  }
  
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.buildEditInventory = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventoryId);
  const nav = await utilities.getNav();

  const inventoryData = (
    await invModel.getInventoryByInventoryId(inventory_id))[0]; // Change this function to return the first item
  const name = `${inventoryData.inv_make} ${inventoryData.inv_model}`;

  let classifications = await utilities.buildClassificationList(inventoryData.classification_id);

  res.render("inventory/editInventory", {
    title: "Edit " + name,
    errors: null,
    nav,
    classifications,
    inv_id: inventoryData.inv_id,
    inv_make: inventoryData.inv_make,
    inv_model: inventoryData.inv_model,
    inv_year: inventoryData.inv_year,
    inv_description: inventoryData.inv_description,
    inv_image: inventoryData.inv_image,
    inv_thumbnail: inventoryData.inv_thumbnail,
    inv_price: inventoryData.inv_price,
    inv_miles: inventoryData.inv_miles,
    inv_color: inventoryData.inv_color,
    classification_id: inventoryData.classification_id,
  });
};

invCont.updateInventory = async function (req, res, next) {
  const nav = await utilities.getNav();

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const response = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (response) {
    const itemName = response.inv_make + " " + response.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classifications = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/editInventory", {
      title: "Edit " + itemName,
      nav,
      errors: null,
      classifications,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

invCont.buildDeleteInventory = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventoryId);
  const nav = await utilities.getNav();

  const inventoryData = (
    await invModel.getInventoryByInventoryId(inventory_id))[0]; // Change this function to return the first item
  const name = `${inventoryData.inv_make} ${inventoryData.inv_model}`;

  res.render("inventory/delete-confirm", {
    title: "Delete " + name,
    errors: null,
    nav,
    inv_id: inventoryData.inv_id,
    inv_make: inventoryData.inv_make,
    inv_model: inventoryData.inv_model,
    inv_year: inventoryData.inv_year,
    inv_price: inventoryData.inv_price,
  });
};

invCont.deleteInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  const inventory_id = parseInt(req.body.inv_id);
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  } = req.body;

  const queryResponse = await invModel.deleteInventory(inventory_id);
  const itemName = `${inv_make} ${inv_model}`;

  if (queryResponse) {
    // const itemName = queryResponse.inv_make + " " + queryResponse.inv_model;
    req.flash("notice", `The ${itemName} was successfully deleted.`);
    res.redirect("/inv/");
  } else {
    // const classifications = await utilities.buildClassificationList(
    //   classification_id
    // );

    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/deleteInventory", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    });
  }
};


module.exports = invCont