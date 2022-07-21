import connection from "../db/postgres.js";

export async function getCustomers(req, res) {
  const customers = await connection.query("SELECT * FROM customers");

  res.send(customers.rows);
}
