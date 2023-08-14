USE openmrs;
SELECT

DATE_FORMAT(getdatevalueobsid(getmaxconceptobsidwithformid(patient.patient_id,5096,27,@endDate)),'%d-%b-%Y') as `Next Pharmacy pickup`,
pid1.identifier as `PatientUniqueID`,
pid2.identifier as  `PatientHospitalNo`,
CONCAT(pn.given_name,' ',pn.family_name) AS `Patient_Name`,
CAST(psn_atr.value AS CHAR) AS `Phone_No`,
IF(TIMESTAMPDIFF(YEAR,person.birthdate,curdate())>=5,TIMESTAMPDIFF(YEAR,person.birthdate,curdate()),null) as `CurrentAgeYears`,
IF(TIMESTAMPDIFF(YEAR,person.birthdate,curdate())<5,TIMESTAMPDIFF(MONTH,person.birthdate,curdate()),null) as `CurrentAgeMonths`,
person.gender as `Sex`,
concat(ifnull (pa.address1, ' '),' ', ifnull( pa.address2, ' '))  as 'Patient Address',
pa.`city_village` AS Patient_LGA,
pa.`state_province` AS Patient_State

FROM patient
  INNER JOIN person on(person.person_id=patient.patient_id and patient.voided=0)
  LEFT JOIN patient_identifier pid1 on(pid1.patient_id=patient.patient_id and patient.voided=0 and pid1.identifier_type=4 and pid1.voided=0)
  LEFT JOIN patient_identifier pid2 on(pid2.patient_id=patient.patient_id and patient.voided=0 and pid2.identifier_type=5 and pid2.voided=0)
  LEFT JOIN person_attribute psn_atr ON (person.person_id=psn_atr.person_id and psn_atr.person_attribute_type_id=8) 
  LEFT JOIN patient_program pprg on(pprg.patient_id=patient.patient_id and pprg.voided=0 and patient.voided=0 and pprg.program_id=1)
  LEFT JOIN `person_address` pa ON (pa.`person_id`=patient.patient_id AND patient.voided=0 AND pa.`preferred`=1)
  LEFT JOIN `person_name` pn ON (pn.`person_id`=patient.patient_id AND patient.voided=0 AND pn.`preferred`=1)
  WHERE patient.voided=0 and pid1.identifier IS NOT NULL
  GROUP BY patient.patient_id;