import pkg from "pg";
import { config } from "../config/config.js";

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL Connected Successfully");
    client.release();
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
    process.exit(1);
  }
};
