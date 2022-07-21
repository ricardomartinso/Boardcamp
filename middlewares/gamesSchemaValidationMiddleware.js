import joi from "joi";
import connection from "../db/postgres.js";

export async function gamesSchemaValidation(req, res, next) {
  const gamesSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().uri().required(),
    stockTotal: joi.number().positive().min(1).required(),
    categoryId: joi.number().positive().required(),
    pricePerDay: joi.number().positive().greater(0).required(),
  });

  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  const repeatedName = await connection.query(
    "SELECT * FROM games WHERE name = $1",
    [name]
  );
  const categoryExist = await connection.query(
    "SELECT * FROM categories WHERE id = $1",
    [categoryId]
  );
  const validation = gamesSchema.validate(
    {
      name,
      image,
      stockTotal,
      categoryId,
      pricePerDay,
    },
    { abortEarly: false }
  );

  if (repeatedName.rows.length >= 1) {
    return res.sendStatus(409);
  }

  if (categoryExist.rows == false) {
    return res.sendStatus(400);
  }

  if (validation.error) {
    const errors = validation.error.details.map((item) => item.message);
    return res.status(400).send(errors);
  }

  next();
}
