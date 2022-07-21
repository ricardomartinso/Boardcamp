import connection from "../db/postgres.js";

export async function getRentals(req, res) {
  const rentals = await connection.query("SELECT * FROM rentals");

  res.send(rentals.rows);
}
