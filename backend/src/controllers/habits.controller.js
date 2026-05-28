import pool from "../db/index.js";

export const getAllHabits = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM habits ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const createHabit = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }
    const result = await pool.query(
      "INSERT INTO habits (name, description) VALUES ($1, $2) RETURNING *",
      [name.trim(), description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteHabit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM habits WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Habit not found" });
    }
    res.json({ message: "Habit deleted successfully", habit: result.rows[0] });
  } catch (error) {
    next(error);
  }
};
