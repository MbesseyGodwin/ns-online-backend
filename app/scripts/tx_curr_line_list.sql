SET @endDate := (SELECT DATE_FORMAT(NOW(), "%Y-%m-%d"));

SET @today_date = (SELECT DATE_FORMAT(NOW(), "%Y-%m-%d"));

SELECT  pid1.identifier                                                                                             AS `PatientUniqueID`
       ,pid2.identifier                                                                                             AS `PatientHospitalNo`
       ,CONCAT(pn.given_name,' ',pn.family_name)                                                                    AS `Patient_Name`
       ,CAST(psn_atr.value AS CHAR)                                                                                 AS `Phone_No`
       ,IF(TIMESTAMPDIFF(YEAR,person.birthdate,curdate()) >= 5,TIMESTAMPDIFF(YEAR,person.birthdate,curdate()),null) AS `CurrentAgeYears`
       ,IF(TIMESTAMPDIFF(YEAR,person.birthdate,curdate()) < 5,TIMESTAMPDIFF(MONTH,person.birthdate,curdate()),null) AS `CurrentAgeMonths`
       ,person.gender                                                                                               AS `Sex`
       ,concat(ifnull (pa.address1,' '),' ',ifnull( pa.address2,' '))                                               AS 'Patient Address'
       ,pa.`city_village`                                                                                           AS Patient_LGA
       ,pa.`state_province`                                                                                         AS Patient_State
       ,date_format(container.last_date,'%d-%b-%Y')                                                                 AS 'Last_Pickup'
       ,getconceptval(getmaxconceptobsidwithformid(obs.person_id,162240,27,@endDate),159368,obs.person_id)          AS 'Days of Refill'
FROM patient
LEFT JOIN person
ON (person.person_id = patient.patient_id AND patient.voided = 0)
LEFT JOIN patient_identifier pid1
ON (pid1.patient_id = patient.patient_id AND patient.voided = 0 AND pid1.identifier_type = 4 AND pid1.voided = 0)
LEFT JOIN person_attribute psn_atr
ON (person.person_id = psn_atr.person_id AND psn_atr.person_attribute_type_id = 8)
LEFT JOIN patient_program pprg
ON (pprg.patient_id = patient.patient_id AND pprg.voided = 0 AND patient.voided = 0 AND pprg.program_id = 1)
LEFT JOIN patient_identifier pid2
ON (pid2.patient_id = patient.patient_id AND patient.voided = 0 AND pid2.identifier_type = 5 AND pid2.voided = 0)
LEFT JOIN `person_address` pa
ON (pa.`person_id` = patient.patient_id AND patient.voided = 0 AND pa.`preferred` = 1)
LEFT JOIN `person_name` pn
ON (pn.`person_id` = patient.patient_id AND patient.voided = 0 AND pn.`preferred` = 1)
LEFT JOIN
(SELECT obs.person_id, obs.concept_id, MAX(obs.obs_datetime) AS last_date, MIN(obs.obs_datetime) AS first_date, DATEDIFF(DATE_ADD(MAX(obs.obs_datetime), INTERVAL getconceptval(getmaxconceptobsidwithformid(obs.person_id, 162240, 27, @endDate), 159368, obs.person_id) DAY), NOW()) >= -28 AS 'Tx_no', getconceptval(getmaxconceptobsidwithformid(obs.person_id, 162240, 27, @endDate), 159368, obs.person_id) AS 'value_numeric'
	FROM obs
	WHERE obs.voided = 0
	AND obs.obs_datetime <= @today_date
	AND concept_id IN (165708, 159368)
	GROUP BY  obs.person_id
	         ,obs.concept_id
) AS container
ON (container.person_id = patient.patient_id AND patient.voided = 0 AND container.Tx_no = 1)
INNER JOIN obs on
(obs.person_id = patient.patient_id AND obs.concept_id = container.concept_id AND obs.obs_datetime = container.last_date AND obs.voided = 0 AND obs.obs_datetime <= @today_date
)
INNER JOIN obs obs2 on
(obs2.person_id = patient.patient_id AND obs2.concept_id = container.concept_id AND obs2.obs_datetime = container.first_date AND obs2.voided = 0 AND obs2.obs_datetime <= @today_date
)
WHERE patient.voided = 0
GROUP BY  patient.patient_id;