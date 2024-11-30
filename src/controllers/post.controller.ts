import { NextFunction, Request, Response } from "express";
import {
  asyncHandler,
  CustomRequest,
  ErrorHandler,
  IPostBody,
  ResponsePayload,
} from "../utils";
import { PostModel } from "../models";

export const createPost = asyncHandler(
  async (
    req: CustomRequest,
    res: Response<ResponsePayload>,
    next: NextFunction
  ) => {
    const userId = req.user.id;
    const { text }: IPostBody = req.body;

    if (!text) return next(new ErrorHandler("Invalid inputs.", 400));

    const newPost = new PostModel({
      text,
      createdBy: userId,
    });

    await newPost.save();

    res.status(201).json({
      status: "success",
      message: "New post added successfully.",
    });
  }
);

export const getAllPosts = asyncHandler(
  async (req: Request, res: Response<ResponsePayload>, next: NextFunction) => {
    const posts = await PostModel.find();
    res.status(200).json({
      status: "success",
      message: "all posts.",
      data: { posts },
    });
  }
);

export const getPost = asyncHandler(
  async (req: Request, res: Response<ResponsePayload>, next: NextFunction) => {
    const { postId } = req.params;
    const post = await PostModel.findById(postId);
    if (!post)
      return next(new ErrorHandler("Post not found with given ID.", 404));

    res.status(200).json({
      status: "success",
      message: "Post found with given ID.",
      data: { post },
    });
  }
);

export const updatePost = asyncHandler(
  async (req: Request, res: Response<ResponsePayload>, next: NextFunction) => {
    const { text }: IPostBody = req.body;

    const { postId } = req.params;

    const existingPost = await PostModel.findById(postId);
    if (!existingPost) {
      return next(new ErrorHandler("Post not found.", 404));
    }

    const updatedData: any = {
      text: text || existingPost.text,
    };

    const updatedPost = await PostModel.findByIdAndUpdate(postId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost) {
      return next(new ErrorHandler("Failed to update the post.", 500));
    }

    res.status(200).json({
      status: "success",
      message: "Post updated successfully.",
    });
  }
);

export const deletePost = asyncHandler(
  async (req: Request, res: Response<ResponsePayload>, next: NextFunction) => {
    const { postId } = req.params;
    const post = await PostModel.findByIdAndDelete(postId);
    if (!post)
      return next(new ErrorHandler("Post not found with given ID.", 404));

    res.status(200).json({
      status: "success",
      message: "Post deleted successfully.",
    });
  }
);
