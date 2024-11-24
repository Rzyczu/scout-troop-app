-- Tworzenie tabeli `users`
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    date_birth DATE NOT NULL
);

-- Tworzenie tabeli `users_login`
CREATE TABLE IF NOT EXISTS users_login (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    mail VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Tworzenie tabeli `users_contact`
CREATE TABLE IF NOT EXISTS users_contact (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    phone_number VARCHAR(15),
    mother_phone_number VARCHAR(15),
    father_phone_number VARCHAR(15),
    parent_email_1 VARCHAR(150),
    parent_email_2 VARCHAR(150)
);

-- Tworzenie tabeli `troops`
CREATE TABLE IF NOT EXISTS troops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    song VARCHAR(100),
    color VARCHAR(50),
    points INT DEFAULT 0,
    leader_id INT UNIQUE REFERENCES users(id)
);

-- Tworzenie tabeli `users_scout`
CREATE TABLE IF NOT EXISTS users_scout (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    function INT NOT NULL,
    open_rank INT NOT NULL,
    achieved_rank INT NOT NULL,
    instructor_rank INT NOT NULL,
    troop_id INT REFERENCES troops(id)
);
