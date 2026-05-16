import pool from "../db/index.js";

// GET /api/logs - Lấy tất cả logs (có thể filter theo habit_id)
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

    query += " ORDER BY logs.completed_date DESC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// POST /api/logs - Đánh dấu hoàn thành habit
export const createLog = async (req, res, next) => {
  try {
    const { habit_id, completed_date, note } = req.body;

    if (!habit_id) {
      return res.status(400).json({ error: "habit_id is required" });
    }

    if (!completed_date) {
      return res.status(400).json({ error: "completed_date is required" });
    }

    // Kiểm tra habit có tồn tại không
    const habitCheck = await pool.query(
      "SELECT id FROM habits WHERE id = $1",
      [habit_id]
    );

    if (habitCheck.rows.length === 0) {
      return res.status(404).json({ error: "Habit not found" });
    }

    // Insert log (nếu đã tồn tại thì update)
    const result = await pool.query(
      `INSERT INTO logs (habit_id, completed_date, note) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (habit_id, completed_date) 
       DO UPDATE SET note = $3, created_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [habit_id, completed_date, note || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
