-- Tworzenie funkcji `update_troop_leader` tylko, jeśli nie istnieje
CREATE OR REPLACE FUNCTION update_troop_leader() RETURNS TRIGGER AS $$
BEGIN
    -- Aktualizacja lidera w tabeli `troops`
    IF NEW.function = 2 THEN
        UPDATE troops
        SET leader_id = NEW.user_id
        WHERE id = NEW.troop_id;
    END IF;

    -- Jeśli lider zostaje zdegradowany, usuń lidera z `troops`
    IF OLD.function = 2 AND NEW.function != 2 AND OLD.troop_id != NEW.troop_id THEN
        UPDATE troops
        SET leader_id = NULL
        WHERE id = OLD.troop_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Usunięcie istniejącego wyzwalacza `update_leader_trigger`
DROP TRIGGER IF EXISTS update_leader_trigger ON users_scout;

-- Tworzenie wyzwalacza `update_leader_trigger`
CREATE TRIGGER update_leader_trigger
AFTER INSERT OR UPDATE ON users_scout
FOR EACH ROW EXECUTE FUNCTION update_troop_leader();
