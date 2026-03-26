
import * as rulesets from "../data/rulesets.mjs";

export default function validateChoice(req, res, next) {
  const { rulesetId, choice } = req.body;

  if (!rulesetId) {
    return res.status(400).json({ error: "rulesetId is required" });
  }

  if (!choice) {
    return res.status(400).json({ error: "choice is required" });
  }

  const ruleset = rulesets.getById(rulesetId);

  if (!ruleset) {
    return res.status(404).json({ error: "Ruleset not found" });
  }

  if (!ruleset.symbols.includes(choice)) {
    return res.status(400).json({ error: "Invalid choice for selected ruleset" });
  }

  req.ruleset = ruleset;
  next();
}