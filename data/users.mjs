import { pool } from "./db.mjs";

export async function create(user) {
  const result = await pool.query(
    `INSERT INTO users (id, username, consent_tos)
     VALUES ($1, $2, $3)
     RETURNING id, username, consent_tos`,
    [user.id, user.username, user.consentToS]
  );

  return {
    id: result.rows[0].id,
    username: result.rows[0].username,
    consentToS: result.rows[0].consent_tos
  };
}

export async function getByUsername(username) {
  const result = await pool.query(
    `SELECT id, username, consent_tos
     FROM users
     WHERE username = $1`,
    [username]
  );

  if (result.rows.length === 0) return null;

  return {
    id: result.rows[0].id,
    username: result.rows[0].username,
    consentToS: result.rows[0].consent_to_s
  };
}

export async function getAll() {
  const result = await pool.query(
    `SELECT id, username, consent_tos
     FROM users`
  );

  return result.rows.map((row) => ({
    id: row.id,
    username: row.username,
    consentToS: row.consent_tos
  }));
}

export async function remove(id) {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [id]
  );

  return result.rows.length > 0;
}