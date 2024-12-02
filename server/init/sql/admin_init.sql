
-- Pobranie ID drużyny `exampleTeam1`
WITH team_id_cte AS (
    SELECT id FROM teams WHERE name = 'exampleTeam1' AND gender = 0
)


-- Dodanie użytkownika do tabeli `users`
INSERT INTO users (name, surname, date_birth, team_id) 
SELECT 'adminName', 'adminSurname', '2000-01-01', team_id_cte.id
FROM team_id_cte
ON CONFLICT DO NOTHING;

-- Pobranie ID użytkownika
INSERT INTO users_login (user_id, mail, password)
SELECT id, 'adm@adm.adm', 'PASSWORD_'
FROM users
WHERE name = 'adminName' AND surname = 'adminSurname' AND date_birth = '2000-01-01'
ON CONFLICT (user_id) DO NOTHING;

-- Dodanie danych kontaktowych
INSERT INTO users_contact (user_id, phone_number)
SELECT id, '123456789'
FROM users
WHERE name = 'adminName' AND surname = 'adminSurname' AND date_birth = '2000-01-01'
ON CONFLICT (user_id) DO NOTHING;

-- Dodanie informacji harcerskich
INSERT INTO users_scout (user_id, function, achieved_rank, open_rank, instructor_rank)
SELECT id, 4, 1, 1, 1
FROM users
WHERE name = 'adminName' AND surname = 'adminSurname' AND date_birth = '2000-01-01'
ON CONFLICT (user_id) DO NOTHING;


