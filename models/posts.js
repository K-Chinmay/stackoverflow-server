import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
  userPosted: { type: String, required: "Post must have an author" },
  userId: { type: String },
  caption: { type: String, required: "Post must have a caption" },
  selectedFile: { type: String },
  likeCount: {
    type: [String],
    default: [],
  },
  dislikeCount: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("Post", PostSchema);
