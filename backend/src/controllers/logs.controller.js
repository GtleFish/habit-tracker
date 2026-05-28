import pool from "../db/index.js";

// GET /api/logs
export const getAllLogs = async (req, res, next) => {
  try {
    const { habit_id } = req.query;

    let query = `
      SELECT logs.*, habits.name as habit_name 
      FROM logs 
      JOIN habits ON logs.habit_id = habits.id
    `;
    let params = [];

    if (habit_id) {
      query += " WHERE logs.habit_id = $1";
      params.push(habit_id);
    }

    query += " ORDER BY logs.completed_date DESC, logs.created_at DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// POST /api/logs
export const createLog = async (req, res, next) => {
  try {
    const { habit_id, completed_date, note, start_time, end_time } = req.body;

    if (!habit_id) {
      return res.status(400).json({ error: "habit_id is required" });
    }
    if (!completed_date) {
      return res.status(400).json({ error: "completed_date is required" });
    }

    const habitCheck = await pool.query(
      "SELECT id FROM habits WHERE id = $1",
      [habit_id]
    );
    if (habitCheck.rows.length === 0) {
      return res.status(404).json({ error: "Habit not found" });
    }

    const result = await pool.query(
      `INSERT INTO logs (habit_id, completed_date, note, start_time, end_time) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (habit_id, completed_date) 
       DO UPDATE SET 
         note = EXCLUDED.note,
         start_time = EXCLUDED.start_time,
         end_time = EXCLUDED.end_time,
         created_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [habit_id, completed_date, note || null, start_time || null, end_time || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/logs?habit_id=&completed_date=
export const deleteLog = async (req, res, next) => {
  try {
    const { habit_id, completed_date } = req.query;

    if (!habit_id || !completed_date) {
      return res.status(400).json({ error: "habit_id and completed_date are required" });
    }

    const result = await pool.query(
      "DELETE FROM logs WHERE habit_id = $1 AND completed_date = $2 RETURNING *",
      [habit_id, completed_date]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Log not found" });
    }

    res.json({ message: "Deleted", log: result.rows[0] });
  } catch (error) {
    next(error);
  }
};
