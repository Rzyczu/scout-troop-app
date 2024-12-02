-- Pobranie ID drużyny `exampleTeam1`
WITH team_id_cte AS (
    SELECT id FROM teams WHERE name = 'exampleTeam1' AND gender = 0
)

-- Wprowadzenie danych do użytkowników
INSERT INTO users (name, surname, date_birth, team_id)
SELECT 'example12', 'example12', '2001-01-01', id
FROM team_id_cte
ON CONFLICT DO NOTHING;

-- Dodanie danych kontaktowych dla użytkownika example1
INSERT INTO users_contact (user_id, phone_number)
SELECT id, '212121212'
FROM users
WHERE name = 'example12' AND surname = 'example12' AND date_birth = '2001-01-01'
ON CONFLICT (user_id) DO NOTHING;

-- Dodanie danych harcerskich dla użytkownika example1
INSERT INTO users_scout (user_id, function, achieved_rank, open_rank, instructor_rank)
SELECT id, 3, 0, 1, 2
FROM users
WHERE name = 'example12' AND surname = 'example12' AND date_birth = '2001-01-01'
ON CONFLICT (user_id) DO NOTHING;

-- Powtórzenie dla użytkownika example2
WITH team_id_cte AS (
    SELECT id FROM teams WHERE name = 'exampleTeam1' AND gender = 0
)
INSERT INTO users (name, surname, date_birth, team_id)
SELECT 'example22', 'example22', '2002-02-02', id
FROM team_id_cte
ON CONFLICT DO NOTHING;

-- Dodanie danych kontaktowych dla użytkownika example2
INSERT INTO users_contact (user_id, phone_number)
SELECT id, '323232323'
FROM users
WHERE name = 'example22' AND surname = 'example22' AND date_birth = '2002-02-02'
ON CONFLICT (user_id) DO NOTHING;

-- Dodanie danych harcerskich dla użytkownika example2
INSERT INTO users_scout (user_id, function, achieved_rank, open_rank, instructor_rank)
SELECT id, 2, 1, 2, 3
FROM users
WHERE name = 'example22' AND surname = 'example22' AND date_birth = '2002-02-02'
ON CONFLICT (user_id) DO NOTHING;
