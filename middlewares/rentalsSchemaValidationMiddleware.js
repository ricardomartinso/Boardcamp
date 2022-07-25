import joi from "joi";
import connection from "../db/postgres.js";

export async function rentalsSchemaValidation(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;

  const rentalsSchema = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().integer().positive().min(1),
  });

  const customerExist = await connection.query(
    "SELECT * FROM customers WHERE id = $1",
    [customerId]
  );

  const gameExist = await connection.query(
    "SELECT * FROM games WHERE id = $1",
    [gameId]
  );

  const { rows: game } = await connection.query(
    `SELECT games."stockTotal" FROM games WHERE id = $1`,
    [gameId]
  );

  const { rows: gamesAlugados } = await connection.query(
    `SELECT rentals.* FROM rentals WHERE rentals."gameId" = $1`,
    [gameId]
  );

  if (gamesAlugados.length === game[0].stockTotal) {
    return res.status(400).send("Sem estoque de jogos!");
  }

  if (customerExist.rows.length === 0 || gameExist.rows.length === 0) {
    return res.sendStatus(400);
  }

  const validation = rentalsSchema.validate(
    {
      customerId,
      gameId,
      daysRented,
    },
    { abortEarly: false }
  );

  if (validation.error) {
    const errors = validation.error.details.map((item) => item.message);
    return res.status(400).send(errors);
  }

  next();
}
