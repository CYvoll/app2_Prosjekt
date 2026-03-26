import express from "express";
import { makeRuleset } from "../modules/ruleset.mjs";
import * as rulesets from "../data/rulesets.mjs";

const rulesetRouter = express.Router();

rulesetRouter.get("/", (req, res) => {
  res.json(rulesets.getAll());
});

rulesetRouter.get("/public", (req, res) => {
  res.json(rulesets.getPublic());
});

rulesetRouter.get("/:rulesetId", (req, res) => {
  const ruleset = rulesets.getById(req.params.rulesetId);

  if (!ruleset) {
    return res.status(404).json({ error: "Ruleset not found" });
  }

  res.json(ruleset);
});

rulesetRouter.post("/", (req, res, next) => {
  try {
    const newRuleset = makeRuleset(req.body);
    const savedRuleset = rulesets.create(newRuleset);
    res.status(201).json(savedRuleset);
  } catch (error) {
    next(error);
  }
});

rulesetRouter.put("/:rulesetId", (req, res) => {
  const updated = rulesets.update(req.params.rulesetId, req.body);

  if (!updated) {
    return res.status(404).json({ error: "Ruleset not found" });
  }

  res.json(updated);
});

rulesetRouter.post("/:rulesetId/share", (req, res) => {
  const sharedRuleset = rulesets.share(req.params.rulesetId);

  if (!sharedRuleset) {
    return res.status(404).json({ error: "Ruleset not found" });
  }

  res.json(sharedRuleset);
});

export default rulesetRouter;