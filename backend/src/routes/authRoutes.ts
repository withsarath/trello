import { Router } from "express";
import { User } from "../models/User.js";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

const authRouter: Router = Router();

authRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Username, Email and password are required!",
      });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        error: "Email is already exists! please login in!",
      });
    }
    const user = await User.create({
      username,
      email,
      password,
    });
    return res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Somthing went wrong in server!!",
    });
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    // Extracting user's email and password from the body
    const { email, password } = req.body;
    // We are finding the email in the database...
    const user = await User.findOne({ email });
    //if there is not user with that email we send this error message
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password!",
      });
    }
    // after finding the email we will compare the password with user password and database stored password
    const isMatch = await user.comparePassword(password);
    // if not match then we will give the error
    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password!",
      });
    }
    // after successfully get the email and password we will give token to the user
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    // return that token and user
    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: "Something wrong in server!!", err,
    });
  }
});

export default authRouter;
