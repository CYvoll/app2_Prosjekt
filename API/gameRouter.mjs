import express from "express"
import validateSymbol from "../Middleware/SelectSymbol.mjs"

const gamesRouter = express.Router();

const testGame = [
    {id: 1, player: "rock", opponent: "paper", result: "win"}
];

gamesRouter.get("/", (req, res, next) => {
    res.status(200);
    res.send(testGame);
});I
