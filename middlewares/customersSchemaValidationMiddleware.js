import joi from "joi";
import connection from "../db/postgres.js";

export async function customersSchemaValidation(req, res, next) {
  const { name, phone, cpf, birthday } = req.body;
  const { id } = req.params;

  const customersSchema = joi.object({
    name: joi.string().required(),
    phone: joi
      .string()
      .pattern(/^[0-9]{10,11}$/)
      .required(),
    cpf: joi
      .string()
      .length(11)
      .pattern(/^[0-9]+$/)
      .required(),
    birthday: joi.date().iso().required(),
  });

  if (id) {
    const notUsersCpf = await connection.query(
      `SELECT * FROM customers WHERE NOT id = $1`,
      [id]
    );

    const repeatedCpf = notUsersCpf.rows.find((user) => user.cpf === cpf);

    if (repeatedCpf) {
      return res.sendStatus(409);
    }
  } else {
    const repeatedCpf = await connection.query(
      "SELECT * FROM customers WHERE cpf = $1",
      [cpf]
    );

    if (repeatedCpf.rows.length >= 1) {
      return res.sendStatus(409);
    }
  }

  const validation = customersSchema.validate(
    {
      name,
      phone,
      cpf,
      birthday,
    },
    { abortEarly: false }
  );

  if (validation.error) {
    const errors = validation.error.details.map((item) => item.message);
    return res.status(400).send(errors);
  }

  next();
}
