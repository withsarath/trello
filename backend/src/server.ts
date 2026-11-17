import express, { type Request, type Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send({message: "working" });
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

connectDB().then(() => {
  app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
