import express from "express";
import { makeRuleset } from "../modules/ruleset.mjs";
import * as rulesets from "../data/rulesets.mjs";

const rulesetRouter = express.Router();

rulesetRouter.get("/", async (req, res, next) => {
  try {
    const allRulesets = await rulesets.getAll();
    res.json(allRulesets);
  } catch (error) {
    next(error);
  }
});

rulesetRouter.get("/public", async (req, res, next) => {
  try {
    const publicRulesets = await rulesets.getPublic();
    res.json(publicRulesets);
  } catch (error) {
    next(error);
  }
});

rulesetRouter.get("/:rulesetId", async (req, res, next) => {
  try {
    const ruleset = await rulesets.getById(req.params.rulesetId);

    if (!ruleset) {
      return res.status(404).json({
        error: "Ruleset not found"
      });
    }

    res.json(ruleset);
  } catch (error) {
    next(error);
  }
});

rulesetRouter.post("/", async (req, res, next) => {
  try {
    const newRuleset = makeRuleset(req.body);
    const savedRuleset = await rulesets.create(newRuleset);

    res.status(201).json(savedRuleset);
  } catch (error) {
    next(error);
  }
});

rulesetRouter.put("/:rulesetId", async (req, res, next) => {
  try {
    const updated = await rulesets.update(req.params.rulesetId, req.body);

    if (!updated) {
      return res.status(404).json({
        error: "Ruleset not found"
      });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

rulesetRouter.post("/:rulesetId/share", async (req, res, next) => {
  try {
    const shared = await rulesets.share(req.params.rulesetId);

    if (!shared) {
      return res.status(404).json({
        error: "Ruleset not found"
      });
    }

    res.json(shared);
  } catch (error) {
    next(error);
  }
});

export default rulesetRouter;