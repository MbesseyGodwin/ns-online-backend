const Globalproperty = require("../models/globalproperty.model.js");

// Retrieve all Globalproperties from the database.
exports.findAll = (req, res) => {
  Globalproperty.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving globalproperties.",
      });
    else res.send(data);
  });
};

