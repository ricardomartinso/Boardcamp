import express from "express";
import { getGames } from "../controllers/gamesController.js";
const gamesRouter = express.Router();

gamesRouter.get(getGames);

export default gamesRouter;
