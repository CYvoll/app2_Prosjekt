import express from "express";
import { makeMatch, applyPlayerChoice, resolveMatch } from "../modules/match.mjs";
import * as matches from "../data/matches.mjs";
import * as rulesets from "../data/rulesets.mjs";

const matchRouter = express.Router();

matchRouter.post("/", async (req, res, next) => {
  try {
    const match = makeMatch(req.body);
    const savedMatch = await matches.create(match);
    res.status(201).json(savedMatch);
  } catch (error) {
    next(error);
  }
});

matchRouter.get("/share/:shareCode", async (req, res, next) => {
  try {
    const match = await matches.getByShareCode(req.params.shareCode);

    if (!match) {
      return res.status(404).json({
        error: "Match not found"
      });
    }

    res.json(match);
  } catch (error) {
    next(error);
  }
});

matchRouter.get("/:matchId", async (req, res, next) => {
  try {
    const match = await matches.getById(req.params.matchId);

    if (!match) {
      return res.status(404).json({
        error: "Match not found"
      });
    }

    res.json(match);
  } catch (error) {
    next(error);
  }
});

matchRouter.post("/:matchId/join", async (req, res, next) => {
  try {
    const match = await matches.getById(req.params.matchId);

    if (!match) {
      return res.status(404).json({
        error: "Match not found"
      });
    }

    if (match.guestUserId) {
      return res.status(409).json({
        error: "Match already has a guest"
      });
    }

    match.guestUserId = req.body.guestUserId;
    const updated = await matches.update(match);

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

matchRouter.post("/:matchId/play", async (req, res, next) => {
  try {
    const { userId, choice } = req.body;

    let match = await matches.getById(req.params.matchId);

    if (!match) {
      return res.status(404).json({
        error: "Match not found"
      });
    }

    const ruleset = await rulesets.getById(match.rulesetId);

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

    match = applyPlayerChoice(match, userId, choice);
    match = resolveMatch(match, ruleset);

    const updated = await matches.update(match);

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

export default matchRouter;