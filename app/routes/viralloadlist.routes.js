module.exports = viralloadlistRoute => {
    const viralloadlist = require("../controllers/viralloadlist.controller.js");

    // Retrieve all viralloadlist
    viralloadlistRoute.get("/viralloadlist", viralloadlist.findAll);
};