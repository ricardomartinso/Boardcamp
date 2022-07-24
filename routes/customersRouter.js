import express from "express";
import {
  createCostumers,
  getCustomers,
  getCustomersById,
  updateCostumers,
} from "../controllers/customersController.js";

import { customersSchemaValidation } from "../middlewares/customersSchemaValidationMiddleware.js";

const customersRouter = express.Router();

customersRouter.get("/customers", getCustomers);

customersRouter.get("/customers/:id", getCustomersById);

customersRouter.post("/customers", customersSchemaValidation, createCostumers);

customersRouter.put(
  "/customers/:id",
  customersSchemaValidation,
  updateCostumers
);

export default customersRouter;
