import pool from "../db/index.js";

export const getLogs = async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    const [logs] = await connection.query(
      "SELECT * FROM logs ORDER BY date DESC"
    );
    connection.release();
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

export const createLog = async (req, res, next) => {
  try {
    const { habitId, date } = req.body;

    if (!habitId || !date) {
      return res.status(400).json({
        error: "Habit ID and date are required"
      });
    }

    const connection = await pool.getConnection();

    try {
      const [result] = await connection.query(
        "INSERT INTO logs (habit_id, date) VALUES (?, ?)",
        [habitId, date]
      );

      const [log] = await connection.query(
        "SELECT * FROM logs WHERE id = ?",
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

