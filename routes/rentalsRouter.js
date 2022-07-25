import express from "express";
import {
  getRentals,
  createRentals,
  returnRentals,
  deleteRentals,
} from "../controllers/rentalsController.js";
import { rentalsSchemaValidation } from "../middlewares/rentalsSchemaValidationMiddleware.js";
const rentalsRouter = express.Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", rentalsSchemaValidation, createRentals);
rentalsRouter.post("/rentals/:id/return", returnRentals);
rentalsRouter.delete("/rentals/:id", deleteRentals);

export default rentalsRouter;
