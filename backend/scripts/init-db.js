import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const initDB = async () => {
  let connection;
  try {
    console.log("Connecting to MySQL...");
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log("Creating database if not exists...");
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );

    await connection.query(`USE ${process.env.DB_NAME}`);

    console.log("Creating tables...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS habits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        habit_id INT NOT NULL,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_habit_date (habit_id, date),
        FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
      );
    `);

    connection.end();
    console.log("✓ Database and tables created successfully");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    if (connection) connection.end();
    process.exit(1);
  }
};

initDB();

