import express from "express";
import validateChoice from "../middlewares/validateChoice.mjs";
import { makeGame } from "../modules/gameLogic.mjs";
import * as games from "../data/games.mjs";

const gameRouter = express.Router();

gameRouter.get("/", (req, res) => {
  res.json(games.getAll());
});

gameRouter.get("/:gameId", (req, res) => {
  const game = games.getById(req.params.gameId);

  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  res.json(game);
});

gameRouter.get("/user/:userId/stats", (req, res) => {
  const stats = games.getStatsByUserId(req.params.userId);
  res.json(stats);
});

gameRouter.post("/", validateChoice, (req, res, next) => {
  try {
    const newGame = makeGame({
      ...req.body,
      ruleset: req.ruleset
    });

    const savedGame = games.create(newGame);
    res.status(201).json(savedGame);
  } catch (error) {
    next(error);
  }
});

export default gameRouter;
