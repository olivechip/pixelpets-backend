CREATE OR REPLACE PROCEDURE decrease_pet_stats()
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE pets
  SET happiness = GREATEST(happiness - 10, 0),  -- Decrease happiness, but not below 0
      hunger = GREATEST(hunger - 10, 0)         -- Decrease hunger, but not below 0
  WHERE owner_id IS NOT NULL;                   -- Exclude pets in the adoption center
END;
$$;

-- Schedule the procedure using pg_cron to run every minute
-- SELECT cron.schedule('*/1 * * * *', 'CALL decrease_pet_stats();');