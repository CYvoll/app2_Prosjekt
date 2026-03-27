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

export async function getLeaderboard() {
  const result = await pool.query(
    `SELECT u.id, u.username,
            COALESCE(SUM(CASE WHEN g.result = 'win' THEN 1 ELSE 0 END), 0) AS wins,
            COUNT(g.id) AS total_games
     FROM users u
     LEFT JOIN games g ON u.id = g.user_id
     GROUP BY u.id, u.username
     ORDER BY wins DESC, total_games DESC, u.username ASC`
  );

  return result.rows.map((row) => ({
    id: row.id,
    username: row.username,
    wins: Number(row.wins),
    totalGames: Number(row.total_games)
  }));
}