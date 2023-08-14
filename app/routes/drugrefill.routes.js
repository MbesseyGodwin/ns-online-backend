module.exports = drugrefillRoute => {
    const drugrefills = require("../controllers/drugrefill.controller.js");
  
   
    // Retrieve all drugrefills
    drugrefillRoute.get("/drugrefill", drugrefills.findAll);

  };
  