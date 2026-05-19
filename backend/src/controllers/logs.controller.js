import pool from "../db/index.js";

export const getLogs = async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    const [logs] = await connection.query(
      "SELECT id, habit_id, DATE_FORMAT(date, '%Y-%m-%d') as date, start_time, end_time, created_at FROM logs ORDER BY date DESC"
    );
    connection.release();
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

export const createLog = async (req, res, next) => {
  try {
    const { habitId, date, startTime, endTime } = req.body;

    if (!habitId || !date) {
      return res.status(400).json({
        error: "Habit ID and date are required"
      });
    }

    if (startTime && endTime) {
      const [start, end] = [startTime, endTime].map(t => t.split(':').map(Number));
      const startMinutes = start[0] * 60 + start[1];
      const endMinutes = end[0] * 60 + end[1];
      if (endMinutes <= startMinutes) {
        return res.status(400).json({
          error: "End time must be after start time"
        });
      }
    }

    const connection = await pool.getConnection();

    try {
      const [result] = await connection.query(
        "INSERT INTO logs (habit_id, date, start_time, end_time) VALUES (?, ?, ?, ?)",
        [habitId, date, startTime || null, endTime || null]
      );

      const [log] = await connection.query(
        "SELECT id, habit_id, DATE_FORMAT(date, '%Y-%m-%d') as date, start_time, end_time, created_at FROM logs WHERE id = ?",
        [result.insertId]
      );

      connection.release();
      res.status(201).json(log[0]);
    } catch (err) {
      connection.release();
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(200).json({
          message: "Log already exists for this date"
        });
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

