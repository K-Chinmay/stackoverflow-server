import express from "express";
import mongoose, { isValidObjectId } from "mongoose";

import posts from "../models/posts.js";
import Questions from "../models/Questions.js";

const router = express.Router();

export const getPosts = async (req, res) => {
  try {
    const postsData = await posts.find();
    res.status(200).json(postsData);
  } catch (error) {
    res.status(404).json({ error });
  }
};

export const createPost = async (req, res) => {
  const data = req.body;
  const newPost = new posts(data);
  try {
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(404).json({ error });
  }
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;
  console.log();
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("post unavailable...");
  }

  try {
    await posts.findByIdAndRemove(_id);
    res.status(200).json({ message: "successfully deleted..." });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  const { id: _id } = req.params;
  const { value, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("post unavailable...");
  }
  try {
    const post = await posts.findById(_id);
    const likeIndex = post.likeCount.findIndex((id) => id === String(userId));
    const dislikeIndex = post.dislikeCount.findIndex(
      (id) => id === String(userId)
    );

    if (value === "like") {
      if (dislikeIndex !== -1) {
        post.dislikeCount = post.dislikeCount.filter(
          (id) => id !== String(userId)
        );
      }
      if (likeIndex === -1) {
        post.likeCount.push(userId);
      } else {
        post.likeCount = post.likeCount.filter((id) => id !== String(userId));
      }
    } else if (value === "dislike") {
      if (likeIndex !== -1) {
        post.likeCount = post.likeCount.filter((id) => id !== String(userId));
      }
      if (dislikeIndex === -1) {
        post.dislikeCount.push(userId);
      } else {
        post.dislikeCount = post.dislikeCount.filter(
          (id) => id !== String(userId)
        );
      }
    }
    await posts.findByIdAndUpdate(_id, post);
    res.status(200).json({ message: "like/dislike successfull..." });
  } catch (error) {
    res.status(500).json({ error });
  }
};
