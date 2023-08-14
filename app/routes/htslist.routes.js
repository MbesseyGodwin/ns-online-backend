module.exports = htslistRoute => {
    const htslist = require("../controllers/htslist.controller.js");

    // Retrieve all htslist
    htslistRoute.get("/htslist", htslist.findAll);
};