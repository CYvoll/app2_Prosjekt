import express from "express";
import { makeUser } from "../modules/user.mjs";
import * as users from "../data/users.mjs";
import * as games from "../data/games.mjs";

const userRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
  try {
    const allUsers = await users.getAll();
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/leaderboard", async (req, res, next) => {
  try {
    const leaderboard = await users.getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/login/:username", async (req, res, next) => {
  try {
    const user = await users.getByUsername(req.params.username);

    if (!user) {
      return res.status(404).json({
       error: req.t.userNotFound
     });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:userId/stats", async (req, res, next) => {
  try {
    const user = await users.getById(req.params.userId);

    if (!user) {
      return res.status(404).json({
       error: req.t.userNotFound
     });
    }

    const stats = await games.getStatsByUserId(req.params.userId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await users.getById(req.params.userId);

    if (!user) {
      return res.status(404).json({
       error: req.t.userNotFound
     });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    const { username } = req.body;

    return res.status(409).json({
      error: req.t.usernameTaken
    });

    const newUser = makeUser(req.body, req.t);
    const savedUser = await users.create(newUser);

    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:userId", async (req, res, next) => {
  try {
    const deleted = await users.remove(req.params.userId);

    if (!deleted) {
      return res.status(404).json({
       error: req.t.userNotFound
     });
    }

    res.json({
      message: "User deleted"
    });
  } catch (error) {
    next(error);
  }
});

export default userRouter;