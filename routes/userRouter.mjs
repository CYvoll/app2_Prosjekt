import express from "express";
import { makeUser } from "../modules/user.mjs";
import * as users from "../data/users.mjs";

const userRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
  try {
    const allUsers = await users.getAll();
    res.json(allUsers);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await users.getById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        error: "User not found"
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

    if (await users.getByUsername(username)) {
      return res.status(409).json({
        error: "Username already taken"
      });
    }

    const newUser = makeUser(req.body);
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
        error: "User not found"
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