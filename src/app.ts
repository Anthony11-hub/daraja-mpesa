import express, { Request, Response, NextFunction } from "express";
import router from "./routes/route";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.use("/", router);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`App running started on port:${PORT}`);
});
