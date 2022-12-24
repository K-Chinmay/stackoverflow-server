import express from "express";
import { login, signup } from "../controllers/auth.js";
import {
  getAllUsers,
  updateProfile,
  followUser,
  unfollowUser,
} from "../controllers/users.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/getAllUsers", getAllUsers);
router.patch("/update/:id", auth, updateProfile);
router.patch("/follow/:id", auth, followUser);
router.patch("/unfollow/:id", auth, unfollowUser);

export default router;
