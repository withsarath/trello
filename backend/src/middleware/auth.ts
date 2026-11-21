import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split("")[1];

  if (!token) {
    return res.status(401).json({
      error: " No token provided",
    });
  }

  try {
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    req.userId = decode.userId;
    next()
  } catch (err) {
    return res.status(401).json({
        error: "Invalid or expired token"
    })
  }
}
