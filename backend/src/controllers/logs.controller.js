import pool from "../db/index.js";

export const getLogs = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, habit_id, TO_CHAR(date, 'YYYY-MM-DD') as date, start_time, end_time, created_at FROM logs ORDER BY date DESC"
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const createLog = async (req, res, next) => {
  try {
    const { habitId, date, startTime, endTime } = req.body;

    if (!habitId || !date) {
      return res.status(400).json({
        error: "Habit ID and date are required",
      });
    }

    if (startTime && endTime) {
      const [start, end] = [startTime, endTime].map((t) =>
        t.split(":").map(Number)
      );
      const startMinutes = start[0] * 60 + start[1];
      const endMinutes = end[0] * 60 + end[1];
      if (endMinutes <= startMinutes) {
        return res.status(400).json({
          error: "End time must be after start time",
        });
      }
    }

    try {
      const result = await pool.query(
        "INSERT INTO logs (habit_id, date, start_time, end_time) VALUES ($1, $2, $3, $4) RETURNING id, habit_id, TO_CHAR(date, 'YYYY-MM-DD') as date, start_time, end_time, created_at",
        [habitId, date, startTime || null, endTime || null]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      // PostgreSQL unique violation error code
      if (err.code === "23505") {
        return res.status(200).json({
          message: "Log already exists for this date",
        });
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
};
