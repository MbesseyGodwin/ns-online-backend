const Htsresult = require("../models/htsresult.model.js");

// Retrieve all Htsresults from the database.
exports.findAll = (req, res) => {
  Htsresult.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving htsresults.",
      });
    else res.send(data);
  });
};