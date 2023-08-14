SELECT
    pid1.identifier AS PepfarID,
    pid2.identifier AS HospID,
    MAX(
        CASE
            WHEN obs.concept_id = 165715 THEN obs.value_text
            ELSE NULL
        END
    ) AS SampleID,
    person.gender AS Sex,
    TIMESTAMPDIFF(YEAR, person.birthdate, CURDATE()) AS Age,
    DATE_FORMAT(encounter.encounter_datetime, '%d-%b-%Y') AS VisitDate,
    MAX(
        CASE
            WHEN obs.concept_id = 856 THEN obs.value_numeric
            ELSE NULL
        END
    ) AS ViralLoadResult,
    MAX(
        CASE
            WHEN obs.concept_id = 164989 THEN DATE_FORMAT(obs.value_datetime, '%d-%b-%Y')
            ELSE NULL
        END
    ) AS OrderedDate,
    MAX(
        CASE
            WHEN obs.concept_id = 159951 THEN DATE_FORMAT(obs.value_datetime, '%d-%b-%Y')
            ELSE NULL
        END
    ) AS SampleCollectionDate,
    MAX(
        CASE
            WHEN obs.concept_id = 164984 THEN DATE_FORMAT(obs.value_datetime, '%d-%b-%Y')
            ELSE NULL
        END
    ) AS CheckedDate,
    MAX(
        CASE
            WHEN obs.concept_id = 165414 THEN DATE_FORMAT(obs.value_datetime, '%d-%b-%Y')
            ELSE NULL
        END
    ) AS ReportedDate,
    MAX(
        CASE
            WHEN obs.concept_id = 166423 THEN DATE_FORMAT(obs.value_datetime, '%d-%b-%Y')
            ELSE NULL
        END
    ) AS ResultDate,
    MAX(
        CASE
            WHEN obs.concept_id = 166424 THEN DATE_FORMAT(obs.value_datetime, '%d-%b-%Y')
            ELSE NULL
        END
    ) AS AssayDate,
    MAX(
        CASE
            WHEN obs.concept_id = 166425 THEN DATE_FORMAT(obs.value_datetime, '%d-%b-%Y')
            ELSE NULL
        END
    ) AS ApprovalDate,
    MAX(
        CASE
            WHEN obs.concept_id = 166422 THEN cn1.name
            ELSE NULL
        END
    ) AS ResultStatus
FROM
    obs
    INNER JOIN patient ON patient.patient_id = obs.person_id
    AND patient.voided = 0
    LEFT JOIN patient_identifier pid1 ON pid1.patient_id = obs.person_id
    AND pid1.identifier_type = 4
    AND pid1.voided = 0
    LEFT JOIN patient_identifier pid2 ON pid2.patient_id = obs.person_id
    AND pid2.identifier_type = 5
    AND pid2.voided = 0
    LEFT JOIN encounter ON encounter.encounter_id = obs.encounter_id
    AND encounter.voided = 0
    left join encounter_provider on(
        encounter_provider.encounter_id = encounter.encounter_id
        and encounter.voided = 0
    )
    left join concept_name cn1 on(
        obs.value_coded = cn1.concept_id
        and cn1.locale = 'en'
        and cn1.locale_preferred = 1
    )
    left join person on(
        person.person_id = obs.person_id
        and person.voided = 0
    )
WHERE
    encounter.form_id = 21
    AND encounter.encounter_datetime IS NOT NULL
    AND encounter.voided = 0
GROUP BY
    encounter.patient_id,
    obs.encounter_id;