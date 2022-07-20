import express from "express";
import categoriesRouter from "./categoriesRouter.js";
import costumersRouter from "./costumersRouter.js";
import gamesRouter from "./gamesRouter.js";
import rentalsRouter from "./rentalsRouter.js";

const router = express.Router();

router.use(categoriesRouter);
router.use(costumersRouter);
router.use(gamesRouter);
router.use(rentalsRouter);

export default router;
