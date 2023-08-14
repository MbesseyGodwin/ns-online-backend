const Fingerprint = require("../models/fingerprint.model.js");

// Create and Save a new Fingerprint
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a Fingerprint
  const fingerprint = new Fingerprint({
    fingerprintData: req.body.fingerprintData,
    userId: req.body.userId,
    date: req.body.date,
  });

  // Save Fingerprint in the database
  Fingerprint.create(fingerprint, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Fingerprint.",
      });
    else res.send(data);
  });
};

// Retrieve all Fingerprints from the database.
exports.findAll = (req, res) => {
  Fingerprint.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving fingerprints.",
      });
    else res.send(data);
  });
};

// Find a single Fingerprint with a fingerprintId
exports.findOne = (req, res) => {
  Fingerprint.findById(req.params.fingerprintId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Fingerprint with id ${req.params.fingerprintId}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Error retrieving Fingerprint with id " + req.params.fingerprintId,
        });
      }
    } else res.send(data);
  });
};

// Update a Fingerprint identified by the fingerprintId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // console.log(req.body);

  Fingerprint.updateById(
    req.params.fingerprintId,
    new Fingerprint(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Fingerprint with id ${req.params.fingerprintId}.`,
          });
        } else {
          res.status(500).send({
            message:
              "Error updating Fingerprint with id " + req.params.fingerprintId,
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Fingerprint with the specified fingerprintId in the request
exports.delete = (req, res) => {
  Fingerprint.remove(req.params.fingerprintId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Fingerprint with id ${req.params.fingerprintId}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Fingerprint with id " + req.params.fingerprintId,
        });
      }
    } else res.send({ message: `Fingerprint was deleted successfully!` });
  });
};

// Delete all Fingerprints from the database.
exports.deleteAll = (req, res) => {
  Fingerprint.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all fingerprints.",
      });
    else res.send({ message: `All Fingerprint were deleted successfully!` });
  });
};
