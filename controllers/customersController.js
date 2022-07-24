import connection from "../db/postgres.js";

export async function getCustomers(req, res) {
  const { cpf } = req.query;

  if (cpf) {
    const customersFiltered = await connection.query(
      `SELECT * FROM customers WHERE customers.cpf ILIKE $1`,
      [`${cpf}%`]
    );

    return res.send(customersFiltered.rows);
  }

  const customers = await connection.query("SELECT * FROM customers");

  res.send(customers.rows);
}

export async function getCustomersById(req, res) {
  const { id } = req.params;

  const customersById = await connection.query(
    "SELECT * FROM customers WHERE id = $1",
    [id]
  );

  console.log(customersById.rows);

  if (customersById.rows.length === 0) {
    return res.sendStatus(404);
  }

  res.send(customersById.rows);
}

export async function createCostumers(req, res) {
  try {
    const { name, cpf, phone, birthday } = req.body;

    await connection.query(
      `INSERT INTO customers (name, cpf, phone, birthday) VALUES ($1, $2, $3, $4)`,
      [name, cpf, phone, birthday]
    );

    res.send(201);
  } catch (err) {
    res.send(500);
  }
}

export async function updateCostumers(req, res) {
  try {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    await connection.query(
      `UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`,
      [name, phone, cpf, birthday, id]
    );

    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}
