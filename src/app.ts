import express, { Request, Response, NextFunction } from "express";
import router from "./routes/route";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: "../.env" });
const app = express();
app.use(express.json());
// app.use(
//   cors({
//     origin: [
//       "196.201.214.200",
//       "196.201.214.206",
//       "196.201.213.114",
//       "196.201.214.207",
//       "196.201.214.208",
//       "196. 201.213.44",
//       "196.201.212.127",
//       "196.201.212.138",
//       "196.201.212.129",
//       "196.201.212.136",
//       "196.201.212.74",
//       "196.201.212.69",
//       "196.201.214.202",
//     ],
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.use("/", router);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`App running started on port:${PORT}`);
});
