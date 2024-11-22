-- Dodanie 2 użytkownika do tabeli `users`
INSERT INTO users (name, surname, date_birth)
VALUES ('example1', 'example1', '2001-01-01')
ON CONFLICT DO NOTHING;

-- Dodanie danych kontaktowych
INSERT INTO users_contact (user_id, phone_number)
SELECT id, '212121212'
FROM users
WHERE name = 'example1' AND surname = 'example1' AND date_birth = '2001-01-01'
ON CONFLICT (user_id) DO NOTHING;

-- Dodanie informacji harcerskich
INSERT INTO users_scout (user_id, function)
SELECT id, 3
FROM users
WHERE name = 'example1' AND surname = 'example1' AND date_birth = '2001-01-01'
ON CONFLICT (user_id) DO NOTHING;
