module.exports = globalpropertyRoute => {
  const globalproperties = require("../controllers/globalproperty.controller.js");

  // Retrieve all globalproperties
  globalpropertyRoute.get("/globalproperties", globalproperties.findAll);
};
