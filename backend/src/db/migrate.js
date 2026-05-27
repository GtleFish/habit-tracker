import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../..", ".env") });

const { default: pool } = await import("./index.js");

async function runMigrations() {
  try {
    console.log("Starting database migrations...");
    console.log(`Connecting to ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}...`);

    const migrationsDir = path.join(__dirname, "migrations");
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      await pool.query(sql);
      console.log(`  ✔ ${file}`);
    }

    console.log("✅ Migrations completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

runMigrations();
