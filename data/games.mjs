import { pool } from "./db.mjs";

export async function create(game) {
  const result = await pool.query(
    `INSERT INTO games (id, user_id, ruleset_id, player_choice, opponent_choice, result)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, user_id, ruleset_id, player_choice, opponent_choice, result`,
    [
      game.id,
      game.userId,
      game.rulesetId,
      game.playerChoice,
      game.opponentChoice,
      game.result
    ]
  );

  return mapRow(result.rows[0]);
}

export async function getByUserId(userId) {
  const result = await pool.query(
    `SELECT id, user_id, ruleset_id, player_choice, opponent_choice, result
     FROM games
     WHERE user_id = $1
     ORDER BY id DESC`,
    [userId]
  );

  return result.rows.map(mapRow);
}

function mapRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    rulesetId: row.ruleset_id,
    playerChoice: row.player_choice,
    opponentChoice: row.opponent_choice,
    result: row.result
  };
}

export async function getStatsByUserId(userId) {
  const result = await pool.query(
    `SELECT result, COUNT(*) as count
     FROM games
     WHERE user_id = $1
     GROUP BY result`,
    [userId]
  );

  const stats = {
    wins: 0,
    losses: 0,
    draws: 0,
    total: 0
  };

  for (const row of result.rows) {
    const count = Number(row.count);

    if (row.result === "win") stats.wins = count;
    if (row.result === "loss") stats.losses = count;
    if (row.result === "draw") stats.draws = count;
  }

  stats.total = stats.wins + stats.losses + stats.draws;
  return stats;
}