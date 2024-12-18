import { loginUser, registerUser } from "../controllers";
import express from "express";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

export { router as authRouter };
