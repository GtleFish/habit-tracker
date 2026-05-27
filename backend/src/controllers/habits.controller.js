import pool from "../db/index.js";

export const getHabits = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM habits ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

export const createHabit = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Habit name is required" });
    }

    const result = await pool.query(
      "INSERT INTO habits (name, description) VALUES ($1, $2) RETURNING *",
      [name, description || ""]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteHabit = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM habits WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.json({ message: "Habit deleted" });
  } catch (err) {
    next(err);
  }
};
