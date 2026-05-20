-- Drop existing tables to apply fresh schema
DROP TABLE IF EXISTS logs;
DROP TABLE IF EXISTS habits;

-- Create habits table
CREATE TABLE habits (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create logs table (matches develop branch controllers)
CREATE TABLE logs (
  id SERIAL PRIMARY KEY,
  habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(habit_id, date)
);

-- Create indexes for better performance
CREATE INDEX idx_logs_habit_id ON logs(habit_id);
CREATE INDEX idx_logs_date ON logs(date);
