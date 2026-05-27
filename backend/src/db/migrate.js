import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pg from "pg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../..", ".env") });

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

async function runMigrations() {
  try {
    console.log("Starting database migrations...");
    console.log(
      `Connecting to ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}...`
    );

    const migrationFile = path.join(__dirname, "migrations", "001_init.sql");
    const sql = fs.readFileSync(migrationFile, "utf8");

    await pool.query(sql);

    console.log("✅ Migrations completed successfully!");
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    await pool.end();
    process.exit(1);
  }
}

runMigrations();
