import express from "express";
import gamesRouter from "./API/gameRouter.mjs";
import userRouter from "./API/userRouter.mjs";
import errorHandler from "./Modules/errorHandler.mjs";

const app = express();
const port = 8080;

app.use(express.static('public'));
app.use(express.json());

app.use("/games", gamesRouter);
app.use("/users", userRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

