import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import {
  asyncHandler,
  ErrorHandler,
  IRegisterBody,
  ResponsePayload,
} from "../utils";
import { UserModel } from "../models";

export const registerUser = asyncHandler(
  async (
    req: Request,
    res: Response<ResponsePayload>,
    next: NextFunction
  ): Promise<void> => {
    const { fullName, email, password }: IRegisterBody = req.body;
    if (!fullName || !email || !password) {
      const err = new ErrorHandler("Invalid input.", 400);
      return next(err);
    }

    const userAlreadyExists = await UserModel.findOne({ email });
    if (userAlreadyExists) {
      return next(new ErrorHandler("User with email already exists.", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new UserModel({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      status: "success",
      message: "User registered successfully.",
    });
  }
);
