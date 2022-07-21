import connection from "../db/postgres.js";

export async function getGames(req, res) {
  const games = await connection.query(
    'SELECT games.id, games.name, games.image, games."stockTotal", games."categoryId", games."pricePerDay", categories.name AS "categoryName" FROM games INNER JOIN categories ON games."categoryId" = categories.id'
  );

  res.send(games.rows);
}

export async function createGames(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  await connection.query(
    'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)',
    [name, image, stockTotal, categoryId, pricePerDay]
  );

  return res.sendStatus(201);
}
