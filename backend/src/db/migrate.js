import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load .env trước khi import pool
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../..", ".env") });

// Import pool sau khi env đã được load
const { default: pool } = await import("./index.js");

async function runMigrations() {
  try {
    console.log("Starting database migrations...");
    console.log(`Connecting to ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}...`);

    const migrationFile = path.join(__dirname, "migrations", "001_init.sql");
    const sql = fs.readFileSync(migrationFile, "utf8");

    await pool.query(sql);

    console.log("✅ Migrations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

runMigrations();
