import express from "express";
import createUser, { generateID } from "../dataObjects/user.mjs";

const UserRouter = express.Router();
UserRouter.use(express.json());

const users = {};

UserRouter.post("/", (req, res) => {
  const { username, acceptTos } = req.body;

  if (!username || typeof username !== "string") {
    return res.status(400).send("username is required");
  }

  if (acceptTos !== true) {
    return res.status(400).send("Terms of Service must be accepted");
  }

  const newUser = createUser();
  newUser.id = generateID();
  newUser.username = username;
  newUser.consentToS = true;

  users[newUser.id] = newUser;

  return res.status(201).json(newUser);
});


UserRouter.delete("/:userId", (req, res) => {
  const userId = req.params.userId;

  if (!users[userId]) {
    return res.status(404).send("user not found");
  }

  delete users[userId];
  return res.status(200).send("account deleted");
});

export default UserRouter;