import { pool } from "./db.mjs";

export async function create(match) {
  const result = await pool.query(
    `INSERT INTO matches (
      id,
      host_user_id,
      guest_user_id,
      ruleset_id,
      host_choice,
      guest_choice,
      result,
      share_code
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      match.id,
      match.hostUserId,
      match.guestUserId,
      match.rulesetId,
      match.hostChoice,
      match.guestChoice,
      match.result,
      match.shareCode
    ]
  );

  return mapRow(result.rows[0]);
}

export async function getById(id) {
  const result = await pool.query(
    `SELECT * FROM matches WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) return null;
  return mapRow(result.rows[0]);
}

export async function getByShareCode(shareCode) {
  const result = await pool.query(
    `SELECT * FROM matches WHERE share_code = $1`,
    [shareCode]
  );

  if (result.rows.length === 0) return null;
  return mapRow(result.rows[0]);
}

export async function update(match) {
  const result = await pool.query(
    `UPDATE matches
     SET guest_user_id = $1,
         host_choice = $2,
         guest_choice = $3,
         result = $4
     WHERE id = $5
     RETURNING *`,
    [
      match.guestUserId,
      match.hostChoice,
      match.guestChoice,
      match.result,
      match.id
    ]
  );

  if (result.rows.length === 0) return null;
  return mapRow(result.rows[0]);
}

function mapRow(row) {
  return {
    id: row.id,
    hostUserId: row.host_user_id,
    guestUserId: row.guest_user_id,
    rulesetId: row.ruleset_id,
    hostChoice: row.host_choice,
    guestChoice: row.guest_choice,
    result: row.result,
    shareCode: row.share_code
  };
}