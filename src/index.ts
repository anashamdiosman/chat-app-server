import express from "express";
import dotenv from "dotenv";
import { env } from "process";

dotenv.config();

const app = express();

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});
