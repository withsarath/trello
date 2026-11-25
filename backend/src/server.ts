import express, { type Request, type Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import dotenv from "dotenv";
import boardRouter from "./routes/boardRoutes.js";
import { listRouter } from "./routes/listRoutes.js";
import { cardRouter } from "./routes/cardRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes)
app.get("/", (req: Request, res: Response) => {
  res.send({message: "working" });
});
app.use('/api/boards', boardRouter);
app.use('/api/lists', listRouter);
app.use('/api/cards', cardRouter);

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

connectDB().then(() => {
  app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
