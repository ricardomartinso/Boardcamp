import express from "express";
import { createGames, getGames } from "../controllers/gamesController.js";
import { gamesSchemaValidation } from "../middlewares/gamesSchemaValidationMiddleware.js";
const gamesRouter = express.Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", gamesSchemaValidation, createGames);

export default gamesRouter;
