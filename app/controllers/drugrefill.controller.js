const Drugrefill = require("../models/drugrefill.model.js");

// Create and Save a new Drugrefill

// Retrieve all Drugrefills from the database.
exports.findAll = (req, res) => {
  Drugrefill.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving drugrefills.",
      });
    else res.send(data);
  });
};
