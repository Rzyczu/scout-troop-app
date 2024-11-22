-- Tworzenie funkcji `validate_function_limit` tylko, jeśli nie istnieje
CREATE OR REPLACE FUNCTION validate_function_limit() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.function > 2 AND NEW.troop_id IS NOT NULL THEN
        RAISE EXCEPTION 'Users with function > 2 cannot belong to a troop.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Usunięcie istniejącego wyzwalacza, jeśli istnieje (zapobiega konfliktom)
DROP TRIGGER IF EXISTS check_function_limit_trigger ON users_scout;

-- Tworzenie wyzwalacza `check_function_limit_trigger`
CREATE TRIGGER check_function_limit_trigger
BEFORE INSERT OR UPDATE ON users_scout
FOR EACH ROW EXECUTE FUNCTION validate_function_limit();
