const sql = require("./db.js");

const Htslist = function (htslist) {
    // this.id = htslist.id;
};

htslist = "select pid1.identifier AS PepfarID, person.gender AS Sex, TIMESTAMPDIFF(YEAR, person.birthdate, CURDATE()) AS Age, patient_program.date_enrolled AS EnrollDate, MAX(IF(target.concept_id = 165843, cn1.name, NULL)) AS `FinalResult` FROM patient LEFT JOIN patient_identifier pid1 ON( pid1.patient_id = patient.patient_id AND pid1.identifier_type = 4 AND pid1.voided = 0 ) LEFT JOIN patient_identifier pid2 ON( pid2.patient_id = patient.patient_id AND pid2.identifier_type = 5 AND pid2.voided = 0 ) LEFT JOIN patient_identifier pid3 ON( pid3.patient_id = patient.patient_id AND pid3.identifier_type = 8 AND pid2.voided = 0 ) LEFT JOIN person_name pn3 ON( patient.patient_id = pn3.person_id AND pn3.voided = 0 ) LEFT JOIN person ON(person.person_id = patient.patient_id) LEFT JOIN person_attribute psn_atr ON (person.person_id = psn_atr.person_id) LEFT JOIN patient_program ON( patient_program.patient_id = person.person_id AND patient_program.voided = 0 ) LEFT JOIN ( SELECT obs.person_id, obs.concept_id, MAX(obs.obs_datetime) AS last_date FROM obs GROUP BY obs.person_id, obs.concept_id ) target ON (target.person_id = patient.patient_id) INNER JOIN obs ON( obs.person_id = target.person_id AND obs.concept_id = target.concept_id AND obs.obs_datetime = target.last_date AND obs.concept_id IN(165843) ) LEFT JOIN concept_name cn1 ON( obs.value_coded = cn1.concept_id AND cn1.locale = 'en' AND cn1.locale_preferred = 1 ) LEFT JOIN ( SELECT obs.person_id, obs.concept_id, MIN(obs.obs_datetime) AS first_date FROM obs GROUP BY obs.person_id, obs.concept_id ) smin ON (smin.person_id = patient.patient_id) INNER JOIN obs obs2 ON( obs2.person_id = smin.person_id AND obs2.concept_id = smin.concept_id AND obs2.obs_datetime = smin.first_date AND obs2.concept_id IN(165843) ) LEFT JOIN concept_name cn2 ON( obs2.value_coded = cn2.concept_id AND cn2.locale = 'en' AND cn2.locale_preferred = 1 ) WHERE patient.voided = 0 GROUP BY patient.patient_id";
Htslist.getAll = (result) => {
    sql.query(htslist, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        // console.log("htslist: ", res);
        result(null, res);
    });
};

module.exports = Htslist;