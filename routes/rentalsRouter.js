import express from "express";
import { getRentals } from "../controllers/rentalsController.js";
const rentalsRouter = express.Router();

rentalsRouter.get(getRentals);

export default rentalsRouter;
