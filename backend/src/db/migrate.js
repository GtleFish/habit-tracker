import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log("Starting database migrations...");

    const migrationFile = path.join(__dirname, "migrations", "001_init.sql");
    const sql = fs.readFileSync(migrationFile, "utf8");

    await pool.query(sql);

    console.log("✅ Migrations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

runMigrations();
