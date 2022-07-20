import connection from "../db/postgres.js";

export async function getCategories(req, res) {
  const categories = await connection.query("SELECT * FROM categories");
  res.send(categories.rows);
}

export async function createCategories(req, res) {
  const { name } = req.body;

  try {
    await connection.query("INSERT INTO categories (name) VALUES ($1)", [name]);
    return res.sendStatus(201);
  } catch (error) {
    console.log("Deu pau");
    res.sendStatus(500);
  }
}
