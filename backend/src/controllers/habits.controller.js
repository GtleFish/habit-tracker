import pool from "../db/index.js";

export const getHabits = async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    const [habits] = await connection.query(
      "SELECT * FROM habits ORDER BY created_at DESC"
    );
    connection.release();
    res.json(habits);
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

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      "INSERT INTO habits (name, description) VALUES (?, ?)",
      [name, description || ""]
    );

    const [habit] = await connection.query(
      "SELECT * FROM habits WHERE id = ?",
      [result.insertId]
    );

    connection.release();
    res.status(201).json(habit[0]);
  } catch (err) {
    next(err);
  }
};

export const deleteHabit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();

    await connection.query("DELETE FROM logs WHERE habit_id = ?", [id]);
    const [result] = await connection.query(
      "DELETE FROM habits WHERE id = ?",
      [id]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.json({ message: "Habit deleted" });
  } catch (err) {
    next(err);
  }
};

