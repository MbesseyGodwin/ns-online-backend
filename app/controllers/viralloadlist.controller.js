const Viralloadlist = require("../models/viralloadlist.model.js");

// Retrieve all viralloadlist from the database.
exports.findAll = (req, res) => {
    Viralloadlist.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving viralloadlist.",
            });
        else res.send(data);
    });
};