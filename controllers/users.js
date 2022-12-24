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
        followers: user.followers,
        following: user.following,
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

export const followUser = async (req, res) => {
  const { id: _id } = req.params;
  const { userId } = req.body;
  if (userId == _id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const followUser = await users.findById(_id);
      const followingUser = await users.findById(userId);

      if (!followUser.followers.includes(userId)) {
        await followUser.updateOne({ $push: { followers: userId } });
        await followingUser.updateOne({ $push: { following: _id } });
        res.status(200).json("User followed!");
      } else {
        res.status(403).json("you are already following this id");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
};

export const unfollowUser = async (req, res) => {
  const { id: _id } = req.params;
  const { userId } = req.body;
  if (userId == _id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const unfollowUser = await users.findById(_id);
      const unfollowingUser = await users.findById(userId);

      if (unfollowUser.followers.includes(userId)) {
        await unfollowUser.updateOne({ $pull: { followers: userId } });
        await unfollowingUser.updateOne({ $pull: { following: _id } });
        res.status(200).json("User unfollowed!");
      } else {
        res.status(403).json("you are not following this id");
      }
    } catch (error) {
      console.log(error.message);
    }
  }
};

// export const unfollowUser = async (req, res) => {
//   const id = req.params.id;
//   const { _id } = req.body;

//   if(_id === id)
//   {
//     res.status(403).json("Action Forbidden")
//   }
//   else{
//     try {
//       const unFollowUser = await UserModel.findById(id)
//       const unFollowingUser = await UserModel.findById(_id)

//       if (unFollowUser.followers.includes(_id))
//       {
//         await unFollowUser.updateOne({$pull : {followers: _id}})
//         await unFollowingUser.updateOne({$pull : {following: id}})
//         res.status(200).json("Unfollowed Successfully!")
//       }
//       else{
//         res.status(403).json("You are not following this User")
//       }
//     } catch (error) {
//       res.status(500).json(error)
//     }
//   }
// };

// export const followUser = async (req, res) => {
//   const id = req.params.id;
//   const { _id } = req.body;
//   console.log(id, _id)
//   if (_id == id) {
//     res.status(403).json("Action Forbidden");
//   } else {
//     try {
//       const followUser = await UserModel.findById(id);
//       const followingUser = await UserModel.findById(_id);

//       if (!followUser.followers.includes(_id)) {
//         await followUser.updateOne({ $push: { followers: _id } });
//         await followingUser.updateOne({ $push: { following: id } });
//         res.status(200).json("User followed!");
//       } else {
//         res.status(403).json("you are already following this id");
//       }
//     } catch (error) {
//       console.log(error)
//       res.status(500).json(error);
//     }
//   }
// };
