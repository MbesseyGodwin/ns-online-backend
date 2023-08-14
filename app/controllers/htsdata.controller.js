const Htsdata = require("../models/htsdata.model.js");

// Retrieve all Htsdata from the database.
exports.findAll = (req, res) => {
    Htsdata.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving htsdata.",
            });
        else res.send(data);
    });
};