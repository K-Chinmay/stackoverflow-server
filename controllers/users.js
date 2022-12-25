import mongoose from "mongoose";
import users from "../models/auth.js";

export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await users.find();
    const allUserDetails = [];
    allUsers.forEach((user) => {
      allUserDetails.push({
        _id: user._id,
        name: user.name,
        about: user.about,
        tags: user.tags,
        joinedOn: user.joinedOn,
        friends: user.friends,
      });
    });
    res.status(200).json(allUserDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { id: _id } = req.params;
  const { name, about, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }

  try {
    const updatedProfile = await users.findByIdAndUpdate(
      _id,
      { $set: { name: name, about: about, tags: tags } },
      { new: true }
    );
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(405).json({ message: error.message });
  }
};

export const friendUser = async (req, res) => {
  const { id: _id } = req.params;
  const { userId } = req.body;
  if (userId == _id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const friendUser = await users.findById(_id);
      const friendingUser = await users.findById(userId);

      if (!friendUser.friends.includes(userId)) {
        await friendUser.updateOne({ $push: { friends: userId } });
        await friendingUser.updateOne({ $push: { friends: _id } });
        res.status(200).json("User followed!");
      } else {
        res.status(403).json("you are already following this id");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
};

export const unfriendUser = async (req, res) => {
  const { id: _id } = req.params;
  const { userId } = req.body;
  if (userId == _id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const unfriendUser = await users.findById(_id);
      const unfriendingUser = await users.findById(userId);

      if (unfriendUser.friends.includes(userId)) {
        await unfriendUser.updateOne({ $pull: { friends: userId } });
        await unfriendingUser.updateOne({ $pull: { friends: _id } });
        res.status(200).json("User unfollowed!");
      } else {
        res.status(403).json("you are not following this id");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
};

export const searchByName = async (req, res) => {
  const { type, query } = req.body;
  try {
    const result = await users.find({ $text: { $search: query } });
    if (!result.length) {
      result = await users.find({});
    }
    res.json(result);
  } catch (error) {
    console.log(error.message);
  }
};
