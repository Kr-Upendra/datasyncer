import { protect } from "../middlewares";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "../controllers";
import express from "express";
const router = express.Router();

router.route("/").get(getAllPosts).post(protect, createPost);
router
  .route("/:postId")
  .get(getPost)
  .patch(protect, updatePost)
  .delete(protect, deletePost);

export { router as postRouter };
