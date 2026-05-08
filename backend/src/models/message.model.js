import { pool } from "../utils/db.js";

export const createMessage = async ({
  conversation_id,
  media_id = null,
  role,
  content,
}) => {
  const query = `
    INSERT INTO messages (conversation_id, media_id, role, content)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [conversation_id, media_id, role, content];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getConversationMessages = async (conversation_id) => {
  const query = `
    SELECT *
    FROM messages
    WHERE conversation_id = $1
    ORDER BY created_at ASC;
  `;

  const { rows } = await pool.query(query, [conversation_id]);
  return rows;
};

export const deleteMessage = async (message_id) => {
  await pool.query(`DELETE FROM messages WHERE id = $1`, [message_id]);

  return { success: true };
};
