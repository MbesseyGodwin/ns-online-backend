use openmrs;

SELECT (SELECT COUNT(DISTINCT person_id,value_coded) FROM openmrs.obs WHERE obs.concept_id = 165843 and voided = 0) AS "TOTAL_HST"