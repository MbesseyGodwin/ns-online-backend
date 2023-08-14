const sql = require("./db.js");

const Drugrefill = function (drugrefill) {
  this.id = drugrefill.id;
  this.template = drugrefill.template;
  this.date_created = drugrefill.date_created;
  this.patient_id = drugrefill.patient_id;
};



const startdate = '2023-04-19';
const enddate = '2023-04-24';
// console.log(enddate);
const drugrefill = "SELECT DISTINCT obs.person_id ,concat(pn.given_name,' ',pn.family_name) AS 'PatientName' ,identifier AS 'PEPFARId' ,DATE_FORMAT(obs.value_datetime, '%Y-%m-%d') AS 'AppointmentDate' ,pa.value AS 'phoneNumber' FROM obs INNER JOIN person_name pn ON pn.person_id = obs.person_id AND pn.voided = 0 INNER JOIN patient_identifier pi ON pi.patient_id = obs.person_id AND identifier_type = 4 LEFT JOIN person_attribute pa ON obs.person_id = pa.person_id AND pa.voided = 0 WHERE concept_id = 5096 AND obs.encounter_id IN ( SELECT distinct encounter_id FROM openmrs.encounter WHERE form_id = 14) AND value_datetime BETWEEN '" + startdate + "' AND '" + enddate + "'";
Drugrefill.getAll = (result) => {
  sql.query(drugrefill, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    // console.log("drugrefills: ", res);
    result(null, res);
  });
};

module.exports = Drugrefill;