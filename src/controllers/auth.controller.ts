import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import {
  asyncHandler,
  ErrorHandler,
  generateToken,
  ILoginBody,
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
    if (!fullName || !email || !password || password.length <= 5) {
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

export const loginUser = asyncHandler(
  async (
    req: Request,
    res: Response<ResponsePayload>,
    next: NextFunction
  ): Promise<void> => {
    const { email, password }: ILoginBody = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Invalid input.", 400));
    }

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) return next(new ErrorHandler("Invalid email or password.", 400));

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return next(new ErrorHandler("Invalid email or password.", 400));

    const token = generateToken(user._id.toString(), user.email, res);

    const data = {
      user: {
        _id: user._id,
        name: user.fullName,
        email: user.email,
      },
      token,
    };

    res.status(200).json({
      status: "success",
      message: "You are logged in successfully.",
      data,
    });
  }
);
