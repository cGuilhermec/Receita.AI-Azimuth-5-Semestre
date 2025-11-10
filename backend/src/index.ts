import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "../db/db";
import { router } from "./routes/route";

dotenv.config();

const app = express();
const Port = process.env.PORT || 3005;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Ou a URL do seu frontend
    credentials: true, // Permite cookies nas requisições
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(router);
connectDB();

app.listen(Port, () => {
  console.log(`The server is running on port: http://localhost:${Port}`);
});
