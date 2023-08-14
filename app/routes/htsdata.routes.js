module.exports = htsdataRoute => {
    const htsdata = require("../controllers/htsdata.controller.js");

    // Retrieve all htsdata
    htsdataRoute.get("/htsdata", htsdata.findAll);
};