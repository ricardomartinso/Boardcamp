import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(router);

app.listen(process.env.PORT);
