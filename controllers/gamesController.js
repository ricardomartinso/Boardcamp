import connection from "../db/postgres.js";

export async function getGames(req, res) {
  const { name } = req.query;
  const { offset } = req.query;
  const { limit } = req.query;

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

  let games;

  games = await connection.query(
    'SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id'
  );

  if (offset) {
    games = await connection.query(
      `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id OFFSET $1`,
      [offset]
    );
  }
  if (limit) {
    games = await connection.query(
      `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id LIMIT $1`,
      [limit]
    );
  }
  if (limit && offset) {
    games = await connection.query(
      `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
  }

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
