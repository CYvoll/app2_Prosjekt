import express from "express";
import { makeGame } from "../modules/game.mjs";
import * as games from "../data/games.mjs";
import { validateChoice } from "../middleware/validateChoice.mjs";

const gameRouter = express.Router();

gameRouter.post("/", validateChoice, async (req, res, next) => {
  try {
    const { userId, choice } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: "userId is required"
      });
    }

    const game = makeGame({
      userId,
      ruleset: req.ruleset,
      choice
    });

    const savedGame = await games.create(game);

    res.status(201).json(savedGame);

  } catch (error) {
    next(error);
  }
});

export default gameRouter;
