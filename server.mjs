import express from "express";
import gamesRouter from "./API/gameRouter.mjs";

const app = express();
const port = 8080;

app.use(express.json());

app.use("/games", gamesRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

