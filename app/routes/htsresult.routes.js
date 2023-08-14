
module.exports = htsresultRoute => {
  const htsresult = require("../controllers/htsresult.controller.js");

  // Retrieve all htsresults
  htsresultRoute.get("/htsresults", htsresult.findAll);
};