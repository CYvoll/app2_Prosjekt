import express from "express"
import validateSymbol from "../Middleware/SelectSymbol.mjs"

const gamesRouter = express.Router();

const testGame = [
    {id: 1, player: "rock", opponent: "paper", result: "win"}
];

gamesRouter.get("/", (req, res, next) => {
    res.status(200);
    res.send(testGame);
});


gamesRouter.get("/:gameId", (req, res, next) => {
  res.send("GameDetails");
});


gamesRouter.post("/", validateSymbol, (req, res, next) => {
  res.send("GameCreated");
});

export default gamesRouter;
