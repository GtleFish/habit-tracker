-- Add start_time and end_time to logs table
ALTER TABLE logs ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE logs ADD COLUMN IF NOT EXISTS end_time TIME;
