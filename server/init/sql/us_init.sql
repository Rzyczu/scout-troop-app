WITH 
    -- Pobranie aktualnego numeru z tabeli user_counter i zwiększenie go o 2
    updated_counter AS (
        UPDATE user_counter 
        SET current_number = current_number + 2 
        RETURNING current_number
    ),

    -- Obliczenie numerów dla dwóch nowych użytkowników
    user_numbers AS (
        SELECT 
            current_number - 1 AS user1_number, 
            current_number AS user2_number 
        FROM updated_counter
    ),

    -- Pobranie ID drużyny `exampleTeam1`
    team_id_cte AS (
        SELECT id FROM teams WHERE name = 'exampleTeam1' AND gender = 0
    ),

    -- Wprowadzenie danych dla użytkowników name{X} i name{Y} w jednej operacji
    inserted_users AS (
        INSERT INTO users (name, surname, date_birth, team_id)
        SELECT 
            'name' || un.user1_number, 
            'surname' || un.user1_number, 
            '2001-01-01'::DATE, 
            t.id
        FROM user_numbers un, team_id_cte t
        UNION ALL
        SELECT 
            'name' || un.user2_number, 
            'surname' || un.user2_number, 
            '2002-02-02'::DATE,
            t.id
        FROM user_numbers un, team_id_cte t
        ON CONFLICT DO NOTHING
        RETURNING id, name, surname, date_birth
    ),

    -- Dodanie danych kontaktowych dla użytkowników name{X} i name{Y} w jednej operacji
    inserted_contacts AS (
        INSERT INTO users_contact (user_id, phone_number)
        SELECT u.id, '212121212'
        FROM inserted_users u 
        WHERE u.name LIKE 'name%' 
          AND u.surname LIKE 'surname%' 
          AND u.date_birth = '2001-01-01'::DATE
        UNION ALL
        SELECT u.id, '323232323'
        FROM inserted_users u 
        WHERE u.name LIKE 'name%' 
          AND u.surname LIKE 'surname%' 
          AND u.date_birth = '2002-02-02'::DATE
        ON CONFLICT (user_id) DO NOTHING
        RETURNING user_id
    )

-- Dodanie danych harcerskich dla użytkowników name{X} i name{Y} w jednej operacji
INSERT INTO users_scout (user_id, function, achieved_rank, open_rank, instructor_rank)
SELECT u.id, 3, 0, 1, 2
FROM inserted_users u 
WHERE u.name LIKE 'name%' 
  AND u.surname LIKE 'surname%' 
  AND u.date_birth = '2001-01-01'::DATE
UNION ALL
SELECT u.id, 2, 1, 2, 3
FROM inserted_users u 
WHERE u.name LIKE 'name%' 
  AND u.surname LIKE 'surname%' 
  AND u.date_birth = '2002-02-02'::DATE
ON CONFLICT (user_id) DO NOTHING;
