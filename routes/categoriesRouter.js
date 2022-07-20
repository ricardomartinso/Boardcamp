import {
  createCategories,
  getCategories,
} from "../controllers/categoriesController.js";
import { categoriesSchemaValidation } from "../middlewares/categoriesSchemaValidationMiddleware.js";

import express from "express";

const categoriesRouter = express.Router();

categoriesRouter.get("/categories", getCategories);

categoriesRouter.post(
  "/categories",
  categoriesSchemaValidation,
  createCategories
);

export default categoriesRouter;
