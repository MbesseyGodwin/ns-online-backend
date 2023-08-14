const sql = require("./db.js");

const Fingerprint = function (fingerprint) {
  this.id = fingerprint.id;
  this.template = fingerprint.template;
  this.date_created = fingerprint.date_created;
  this.patient_id = fingerprint.patient_id;
};

Fingerprint.create = (newFingerprint, result) => {
  sql.query("INSERT INTO fingerprints SET ?", newFingerprint, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created fingerprint: ", {
      id: res.insertId,
      ...newFingerprint,
    });
    result(null, { id: res.insertId, ...newFingerprint });
  });
};

Fingerprint.findById = (fingerprintId, result) => {
  sql.query(
    `SELECT * FROM fingerprints WHERE id = ${fingerprintId}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log("found fingerprint: ", res[0]);
        result(null, res[0]);
        return;
      }

      // not found fingerprint with the id
      result({ kind: "not_found" }, null);
    }
  );
};
const pbs = "select DISTINCT person_name.family_name, person_name.given_name, pi.identifier, biometricinfo.date_created, person.gender from person_name left join person on person_name.person_name_id = person.person_id left join patient_identifier pi on pi.patient_id = person_name.person_name_id and pi.identifier_type = 4 left join biometricinfo on person_name.person_name_id = biometricinfo.patient_Id where (biometricinfo.template like 'Rk1S%' or CONVERT(new_template USING utf8) LIKE 'Rk1S%') ORDER BY person_name.person_name_id";

Fingerprint.getAll = (result) => {
  sql.query(pbs, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("fingerprints: ", res);
    result(null, res);
  });
};

Fingerprint.updateById = (id, fingerprint, result) => {
  sql.query(
    "UPDATE fingerprints SET template = ?, date_created = ?, patient_id = ? WHERE id = ?",
    [
      fingerprint.template,
      fingerprint.date_created,
      fingerprint.patient_id,
      id,
    ],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found fingerprint with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated fingerprint: ", { id: id, ...fingerprint });
      result(null, { id: id, ...fingerprint });
    }
  );
};

Fingerprint.remove = (id, result) => {
  sql.query("DELETE FROM fingerprints WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found fingerprint with the id
      result(
        {
          kind: "not_found",
        },
        null
      );
      return;
    }

    console.log("deleted fingerprint with id: ", id);
    result(null, res);
  });
};

Fingerprint.removeAll = (result) => {
  sql.query("DELETE FROM fingerprint", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} fingerprint`);
    result(null, res);
  });
};

module.exports = Fingerprint;