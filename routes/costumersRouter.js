import express from "express";
import { getCostumers } from "../controllers/costumersController.js";
const costumersRouter = express.Router();

costumersRouter.get(getCostumers);

export default costumersRouter;
