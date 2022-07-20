import { getCategories } from "../controllers/categoriesController.js";
import express from "express";

const categoriesRouter = express.Router();

categoriesRouter.get(getCategories);

export default categoriesRouter;
