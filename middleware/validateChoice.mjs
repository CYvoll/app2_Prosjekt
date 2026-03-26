import { getDefaultRuleset } from "../data/rulesets.mjs";

export async function validateChoice(req, res, next) {
  const { choice } = req.body;

  const ruleset = getDefaultRuleset();

  if (!choice) {
    return res.status(400).json({
      error: "Choice is required"
    });
  }

  if (!ruleset.symbols.includes(choice)) {
    return res.status(400).json({
      error: "Invalid choice"
    });
  }

  req.ruleset = ruleset;
  next();
}