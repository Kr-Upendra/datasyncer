import { registerUser } from "../controllers";
import express from "express";
const router = express.Router();

router.route("/register").post(registerUser);

export { router as authRouter };
