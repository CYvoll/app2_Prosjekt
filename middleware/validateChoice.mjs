import * as rulesets from "../data/rulesets.mjs";

export async function validateChoice(req, res, next) {
  const { rulesetId, choice } = req.body;

  if (!rulesetId || !choice) {
    return res.status(400).json({
      error: "rulesetId and choice are required"
    });
  }

  const ruleset = await rulesets.getById(rulesetId);

  if (!ruleset) {
    return res.status(404).json({
      error: "Ruleset not found"
    });
  }

  if (!ruleset.symbols.includes(choice)) {
    return res.status(400).json({
      error: "Invalid choice for this ruleset"
    });
  }

  req.ruleset = ruleset;
  next();
}