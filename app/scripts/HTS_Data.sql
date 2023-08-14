select
pi.identifier as 'PatientID', pn.gender as 'Gender',
floor(datediff(now(), pn.birthdate)/365.25) as 'Age', 
date_format(o.value_datetime, '%d-%m-%Y') as 'HIVTestDate' 
from patient p Inner join patient_identifier pi on pi.patient_id = p.patient_id 
and pi.voided = 0 and p.voided = 0 and identifier_type = 4 
Inner join person pn on pn.person_id = p.patient_id 
and pn.voided = 0 and p.voided = 0 Left join obs o on o.person_id = p.patient_id 
and p.voided = 0 and o.voided = 0 and concept_id = 165845 GROUP BY p.patient_id