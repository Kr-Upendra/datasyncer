import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(cors({ credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Base route for data syncer backend application.",
  });
});

export default app;
