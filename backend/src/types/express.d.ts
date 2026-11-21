declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
  interface JwtPayload {
    userId: string;
  }
}

export {};
