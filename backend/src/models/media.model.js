import { pool } from "../utils/db.js";

export const createMedia = async ({
  user_id,
  conversation_id,
  file_name,
  original_name,
  file_type,
  mime_type,
  file_size,
  storage_path,
  thumbnail_path = null,
  extracted_text = null,
  metadata = {},
}) => {
  const query = `
    INSERT INTO media (
      user_id,
      conversation_id,
      file_name,
      original_name,
      file_type,
      mime_type,
      file_size,
      storage_path,
      thumbnail_path,
      extracted_text,
      metadata
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *;
  `;

  const values = [
    user_id,
    conversation_id,
    file_name,
    original_name,
    file_type,
    mime_type,
    file_size,
    storage_path,
    thumbnail_path,
    extracted_text,
    JSON.stringify(metadata),
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getMediaByConversation = async (conversation_id) => {
  const query = `
    SELECT *
    FROM media
    WHERE conversation_id = $1
    ORDER BY created_at DESC;
  `;

  const { rows } = await pool.query(query, [conversation_id]);
  return rows;
};

export const getMediaById = async (media_id) => {
  const query = `
    SELECT *
    FROM media
    WHERE id = $1;
  `;

  const { rows } = await pool.query(query, [media_id]);
  return rows[0];
};

export const deleteMedia = async (media_id) => {
  await pool.query(`DELETE FROM media WHERE id = $1`, [media_id]);

  return { success: true };
};
