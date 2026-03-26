import express from "express";
import { makeUser } from "../modules/userLogic.mjs";
import * as users from "../data/users.mjs";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.json(users.getAll());
});

userRouter.get("/:userId", (req, res) => {
  const user = users.getById(req.params.userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

userRouter.post("/", (req, res, next) => {
  try {
       const { username } = req.body;

    if (users.getByUsername(username)) {
      return res.status(409).json({
        error: "Username already taken"
      });
    }
    const newUser = makeUser(req.body);
    const savedUser = users.create(newUser);
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:userId", (req, res) => {
  const deleted = users.remove(req.params.userId);

  if (!deleted) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ message: "User deleted" });
});

export default userRouter;