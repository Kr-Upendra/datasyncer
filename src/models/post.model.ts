import { Schema, model, Types } from "mongoose";

const postSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const PostModel = model("Post", postSchema);
