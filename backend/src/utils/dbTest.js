import { pool } from "./db.js";

export const testDatabaseTables = async () => {
  try {
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log("Database Tables:");
    result.rows.forEach((row) => {
      console.log(`- ${row.table_name}`);
    });
  } catch (error) {
    console.error("DB Table Test Failed:", error.message);
  }
};
