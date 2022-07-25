import connection from "../db/postgres.js";

export async function getCategories(req, res) {
  const { offset } = req.query;
  const { limit } = req.query;

  let categories;

  categories = await connection.query("SELECT * FROM categories");

  if (offset) {
    categories = await connection.query(`SELECT * FROM categories OFFSET $1`, [
      offset,
    ]);
  }
  if (limit) {
    categories = await connection.query(`SELECT * FROM categories LIMIT $1`, [
      limit,
    ]);
  }
  if (limit && offset) {
    categories = await connection.query(
      `SELECT * FROM categories LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
  }

  res.send(categories.rows);
}

export async function createCategories(req, res) {
  const { name } = req.body;

  const repeatedCategories = await connection.query(
    "SELECT * FROM categories WHERE name = $1",
    [name]
  );

  if (repeatedCategories.rows.length >= 1) {
    return res.sendStatus(409);
  }

  try {
    await connection.query("INSERT INTO categories (name) VALUES ($1)", [name]);
    return res.sendStatus(201);
  } catch (error) {
    console.log("Deu pau");
    res.sendStatus(500);
  }
}
