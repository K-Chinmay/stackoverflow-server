import express from "express";
import { login, signup } from "../controllers/auth.js";
import {
  getAllUsers,
  updateProfile,
  friendUser,
  unfriendUser,
  searchByName,
} from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/getAllUsers", getAllUsers);
router.post("/search", searchByName);
router.patch("/update/:id", auth, updateProfile);
router.patch("/friend/:id", auth, friendUser);
router.patch("/unfriend/:id", auth, unfriendUser);

export default router;
