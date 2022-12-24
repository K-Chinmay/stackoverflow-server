import express from "express";
import {
  getPosts,
  createPost,
  deletePost,
  likePost,
} from "../controllers/posts.js";

import auth from "../middleware/auth.js";
// import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/getPosts", getPosts);
router.post("/createPost", auth /*, upload.single("file")*/, createPost);
router.delete("/delete/:id", auth, deletePost);
router.patch("/like/:id", auth, likePost);

export default router;
