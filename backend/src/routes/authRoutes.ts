import { Router } from "express";
import { User } from "../models/User.js";
import type { Request, Response } from "express";

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

export default authRouter;
