import joi from "joi";

export function categoriesSchemaValidation(req, res, next) {
  const categorieSchema = joi.object({
    name: joi.string().required(),
  });

  const { name } = req.body;

  const validation = categorieSchema.validate({ name });
  if (validation.error) {
    const errors = validation.error.details.map((item) => item.message);
    res.status(400).send(errors);
    return;
  }
  next();
}
