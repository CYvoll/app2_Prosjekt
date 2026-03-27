import express from "express";
import userRouter from "./routes/userRouter.mjs";
import gameRouter from "./routes/gameRouter.mjs";
import rulesetRouter from "./routes/rulesetRouter.mjs";
import errorHandler from "./middleware/errorHandler.mjs";
import matchRouter from "./routes/matchRouter.mjs";
import i18n from "./middleware/i18n.mjs";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static("public"));

app.use("/users", userRouter);
app.use("/games", gameRouter);
app.use("/rulesets", rulesetRouter);
app.use("/matches", matchRouter);
app.use(i18n);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

