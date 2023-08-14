const sql = require("./db.js");

const Htsresult = function (htsresult) {
  // this.id = htsresult.id;
};

htsresult = "SELECT COUNT(DISTINCT CASE WHEN obs.value_coded = 703 THEN obs.person_id END) AS 'TOTAL_HTS_POS', COUNT(DISTINCT CASE WHEN obs.value_coded = 664 THEN obs.person_id END) AS 'TOTAL_HTS_NEG' FROM openmrs.obs WHERE obs.concept_id = 165843 AND obs.voided = 0";
Htsresult.getAll = (result) => {
  sql.query(htsresult, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    // console.log("htsresults: ", res);
    result(null, res);
  });
};

module.exports = Htsresult;