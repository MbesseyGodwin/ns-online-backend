SET @endDate := (SELECT DATE_FORMAT(NOW(), "%Y-%m-%d"));
SET @today_date = (SELECT DATE_FORMAT(NOW(), "%Y-%m-%d"));
Select
pid1.identifier as `PatientUniqueID`,
pid2.identifier as  `PatientHospitalNo`,
CONCAT(pn.given_name,' ',pn.family_name) AS `Patient_Name`,
CAST(psn_atr.value AS CHAR) AS `Phone_No`,
IF(TIMESTAMPDIFF(YEAR,person.birthdate,curdate())>=5,TIMESTAMPDIFF(YEAR,person.birthdate,curdate()),null) as `CurrentAgeYears`,
IF(TIMESTAMPDIFF(YEAR,person.birthdate,curdate())<5,TIMESTAMPDIFF(MONTH,person.birthdate,curdate()),null) as `CurrentAgeMonths`,
person.gender as `Sex`,
concat(ifnull (pa.address1, ' '),' ', ifnull( pa.address2, ' '))  as 'Patient Address',
pa.`city_village` AS Patient_LGA,
pa.`state_province` AS Patient_State,
DATE_FORMAT(container.last_date, '%d-%b-%Y') as 'Last_Pickup',
getconceptval(getmaxconceptobsidwithformid(obs.person_id,162240,27,@endDate),159368,obs.person_id) as 'Days of Refill'
FROM patient
  LEFT JOIN person on(person.person_id=patient.patient_id and patient.voided=0)
  LEFT JOIN patient_identifier pid1 on(pid1.patient_id=patient.patient_id and patient.voided=0 and pid1.identifier_type=4 and pid1.voided=0)
  LEFT JOIN person_attribute psn_atr ON (person.person_id=psn_atr.person_id and psn_atr.person_attribute_type_id=8) 
  LEFT JOIN patient_program pprg on(pprg.patient_id=patient.patient_id and pprg.voided=0 and patient.voided=0 and pprg.program_id=1)
  LEFT JOIN patient_identifier pid2 on(pid2.patient_id=patient.patient_id and patient.voided=0 and pid2.identifier_type=5 and pid2.voided=0)
  LEFT JOIN `person_address` pa ON (pa.`person_id`=patient.patient_id AND patient.voided=0 AND pa.`preferred`=1)
  LEFT JOIN `person_name` pn ON (pn.`person_id`=patient.patient_id AND patient.voided=0 AND pn.`preferred`=1)
  LEFT JOIN
  (select 
obs.person_id,
obs.concept_id,
MAX(obs.obs_datetime)  as last_date,
MIN(obs.obs_datetime) as first_date,
DATEDIFF(DATE_ADD(MAX(obs.obs_datetime), INTERVAL getconceptval(getmaxconceptobsidwithformid(obs.person_id,162240,27,@endDate),159368,obs.person_id) DAY), NOW()) BETWEEN -180 AND -29 AS 'iit_no',
getconceptval(getmaxconceptobsidwithformid(obs.person_id,162240,27,@endDate),159368,obs.person_id) as 'value_numeric'
from obs 
where obs.voided=0 
and obs.obs_datetime<=@today_date
and concept_id in(165708,159368) GROUP BY obs.person_id, obs.concept_id) as container 
on (container.person_id=patient.patient_id and patient.voided=0 and container.iit_no = 1)
INNER JOIN obs on(obs.person_id=patient.patient_id and obs.concept_id=container.concept_id and obs.obs_datetime=container.last_date and obs.voided=0 and obs.obs_datetime<=@today_date)
INNER JOIN obs obs2 on(obs2.person_id=patient.patient_id and obs2.concept_id=container.concept_id and obs2.obs_datetime=container.first_date and obs2.voided=0 and obs2.obs_datetime<=@today_date)
WHERE patient.voided=0
GROUP BY patient.patient_id 