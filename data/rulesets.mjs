import { pool } from "./db.mjs";

export async function create(ruleset) {
  const result = await pool.query(
    `INSERT INTO rulesets (id, owner_id, name, symbols, rules, is_public)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, owner_id, name, symbols, rules, is_public`,
    [
      ruleset.id,
      ruleset.ownerId,
      ruleset.name,
      JSON.stringify(ruleset.symbols),
      JSON.stringify(ruleset.rules),
      ruleset.isPublic
    ]
  );

  return mapRow(result.rows[0]);
}

export async function getById(id) {
  const result = await pool.query(
    `SELECT id, owner_id, name, symbols, rules, is_public
     FROM rulesets
     WHERE id = $1`,
    [id]
  );

  if (result.rows.length === 0) return null;
  return mapRow(result.rows[0]);
}

export async function getAll() {
  const result = await pool.query(
    `SELECT id, owner_id, name, symbols, rules, is_public
     FROM rulesets
     ORDER BY name`
  );

  return result.rows.map(mapRow);
}

export async function getByOwnerId(ownerId) {
  const result = await pool.query(
    `SELECT id, owner_id, name, symbols, rules, is_public
     FROM rulesets
     WHERE owner_id = $1
     ORDER BY name`,
    [ownerId]
  );

  return result.rows.map(mapRow);
}

export async function getPublic() {
  const result = await pool.query(
    `SELECT id, owner_id, name, symbols, rules, is_public
     FROM rulesets
     WHERE is_public = true
     ORDER BY name`
  );

  return result.rows.map(mapRow);
}

export async function update(id, updates) {
  const existing = await getById(id);

  if (!existing) return null;

  const updated = {
    ...existing,
    ...updates
  };

  const result = await pool.query(
    `UPDATE rulesets
     SET name = $1,
         symbols = $2,
         rules = $3,
         is_public = $4
     WHERE id = $5
     RETURNING id, owner_id, name, symbols, rules, is_public`,
    [
      updated.name,
      JSON.stringify(updated.symbols),
      JSON.stringify(updated.rules),
      updated.isPublic,
      id
    ]
  );

  return mapRow(result.rows[0]);
}

export async function share(id) {
  const result = await pool.query(
    `UPDATE rulesets
     SET is_public = true
     WHERE id = $1
     RETURNING id, owner_id, name, symbols, rules, is_public`,
    [id]
  );

  if (result.rows.length === 0) return null;
  return mapRow(result.rows[0]);
}

function mapRow(row) {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    symbols: typeof row.symbols === "string" ? JSON.parse(row.symbols) : row.symbols,
    rules: typeof row.rules === "string" ? JSON.parse(row.rules) : row.rules,
    isPublic: row.is_public
  };
}