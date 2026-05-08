import { pool } from "../utils/db.js";

export const createUser = async ({
  clerk_id,
  email,
  full_name,
  profile_image,
}) => {
  const query = `
    INSERT INTO users (clerk_id, email, full_name, profile_image)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (clerk_id)
    DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      profile_image = EXCLUDED.profile_image,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  const values = [clerk_id, email, full_name, profile_image];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getUserByClerkId = async (clerk_id) => {
  const { rows } = await pool.query(`SELECT * FROM users WHERE clerk_id = $1`, [
    clerk_id,
  ]);

  return rows[0];
};
