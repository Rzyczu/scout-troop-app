-- Tworzenie funkcji `validate_leader` tylko, jeśli nie istnieje
CREATE OR REPLACE FUNCTION validate_leader() RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM users_scout 
        WHERE troop_id = NEW.troop_id AND function = 2
    ) AND NEW.function = 2 THEN
        RAISE EXCEPTION 'Troop already has a leader.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Usunięcie istniejącego wyzwalacza, jeśli istnieje (zapobiega konfliktom)
DROP TRIGGER IF EXISTS check_leader_trigger ON users_scout;

-- Tworzenie wyzwalacza `check_leader_trigger`
CREATE TRIGGER check_leader_trigger
BEFORE INSERT OR UPDATE ON users_scout
FOR EACH ROW EXECUTE FUNCTION validate_leader();
