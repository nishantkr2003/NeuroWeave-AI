import { pool } from "../utils/db.js";

export const createConversation = async (
  user_id,
  title = "New Conversation",
) => {
  const query = `
    INSERT INTO conversations (user_id, title)
    VALUES ($1, $2)
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [user_id, title]);
  return rows[0];
};

export const getUserConversations = async (user_id) => {
  const query = `
    SELECT *
    FROM conversations
    WHERE user_id = $1
    ORDER BY updated_at DESC;
  `;

  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

export const getConversationById = async (conversation_id) => {
  const query = `
    SELECT *
    FROM conversations
    WHERE id = $1;
  `;

  const { rows } = await pool.query(query, [conversation_id]);
  return rows[0];
};

export const deleteConversation = async (conversation_id) => {
  await pool.query(`DELETE FROM conversations WHERE id = $1`, [
    conversation_id,
  ]);

  return { success: true };
};
