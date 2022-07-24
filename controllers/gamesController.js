import connection from "../db/postgres.js";

export async function getGames(req, res) {
  const { name } = req.query;

  if (name) {
    const gamesFiltered = await connection.query(
      `SELECT games.*, categories.name 
      AS "categoryName" 
      FROM games 
      JOIN categories 
      ON games."categoryId" = categories.id WHERE games.name ILIKE $1`,
      [`${name}%`]
    );

    return res.send(gamesFiltered.rows);
  }

  const games = await connection.query(
    'SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id'
  );

  res.send(games.rows);
}

export async function createGames(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  await connection.query(
    `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`,
    [name, image, stockTotal, categoryId, pricePerDay]
  );

  return res.sendStatus(201);
}
