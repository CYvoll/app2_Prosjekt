import express from "express";
import path from "node:path";

import userRouter from "./routes/userRouter.mjs";
import gameRouter from "./routes/gameRouter.mjs";
import rulesetRouter from "./routes/rulesetRouter.mjs";
import errorHandler from "./middleware/errorHandler.mjs";
import matchRouter from "./routes/matchRouter.mjs";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static("public"));

app.use("/users", userRouter);
app.use("/games", gameRouter);
app.use("/rulesets", rulesetRouter);
app.use("/matches", matchRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

