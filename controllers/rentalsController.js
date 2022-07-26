import connection from "../db/postgres.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
  const { customerId } = req.query;
  const { gameId } = req.query;
  const { limit } = req.query;
  const { offset } = req.query;

  let rentals;

  if (customerId) {
    rentals = await connection.query(
      `SELECT rentals.*, customers.id AS customer_id, customers.name AS customer_name, games.id AS game_id, games.name AS game_name, games."categoryId", categories.name AS "categoryName"
      FROM rentals 
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON categories.id = games.id WHERE "customerId" = $1`,
      [customerId]
    );
  }
  if (gameId) {
    rentals = await connection.query(
      `SELECT rentals.*, customers.id AS customer_id, customers.name AS customer_name, games.id AS game_id, games.name AS game_name, games."categoryId", categories.name AS "categoryName"
      FROM rentals 
      JOIN customers
      ON rentals."customerId" = customers.id
      JOIN games
      ON rentals."gameId" = games.id
      JOIN categories
      ON categories.id = games.id WHERE "gameId" = $1`,
      [gameId]
    );
  }
  if (!gameId && !customerId) {
    rentals = await connection.query(
      `SELECT rentals.*, customers.id 
      AS customer_id, customers.name 
      AS customer_name, games.id 
      AS game_id, games.name 
      AS game_name, games."categoryId", categories.name AS "categoryName"
      FROM rentals 
      JOIN customers ON rentals."customerId" = customers.id 
      JOIN games ON rentals."gameId" = games.id
      JOIN categories ON categories.id = games."categoryId"`
    );
  }
  if (limit) {
    rentals = await connection.query(
      `SELECT rentals.*, customers.id 
      AS customer_id, customers.name 
      AS customer_name, games.id 
      AS game_id, games.name 
      AS game_name, games."categoryId", categories.name AS "categoryName"
      FROM rentals 
      JOIN customers ON rentals."customerId" = customers.id 
      JOIN games ON rentals."gameId" = games.id
      JOIN categories ON categories.id = games."categoryId" LIMIT $1`,
      [limit]
    );
  }
  if (offset) {
    rentals = await connection.query(
      `SELECT rentals.*, customers.id 
      AS customer_id, customers.name 
      AS customer_name, games.id 
      AS game_id, games.name 
      AS game_name, games."categoryId", categories.name AS "categoryName"
      FROM rentals 
      JOIN customers ON rentals."customerId" = customers.id 
      JOIN games ON rentals."gameId" = games.id
      JOIN categories ON categories.id = games."categoryId" OFFSET $1`,
      [offset]
    );
  }
  if (limit && offset) {
    rentals = await connection.query(
      `SELECT rentals.*, customers.id 
      AS customer_id, customers.name 
      AS customer_name, games.id 
      AS game_id, games.name 
      AS game_name, games."categoryId", categories.name AS "categoryName"
      FROM rentals 
      JOIN customers ON rentals."customerId" = customers.id 
      JOIN games ON rentals."gameId" = games.id
      JOIN categories ON categories.id = games."categoryId" LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
  }

  const infosJson = [];

  rentals.rows.map((rental) => {
    infosJson.push({
      id: rental.id,
      customerId: rental.customerId,
      gameId: rental.gameId,
      rentDate: rental.rentDate,
      daysRented: rental.daysRented,
      returnDate: rental.returnDate, // troca pra uma data quando já devolvido
      originalPrice: rental.originalPrice,
      delayFee: rental.delayFee,
      customer: {
        id: rental.customer_id,
        name: rental.customer_name,
      },
      game: {
        id: rental.game_id,
        name: rental.game_name,
        categoryId: rental.categoryId,
        categoryName: rental.categoryName,
      },
    });
  });

  res.send(infosJson);
}

export async function createRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body;

  const actualDate = dayjs().format("YYYY-MM-DD");

  const { rows: gameInfo } = await connection.query(
    `SELECT * FROM games WHERE id = $1`,
    [gameId]
  );

  const originalPrice = daysRented * gameInfo[0].pricePerDay;

  await connection.query(
    `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [customerId, gameId, actualDate, daysRented, null, originalPrice, null]
  );

  return res.sendStatus(201);
}

export async function returnRentals(req, res) {
  const { id } = req.params;

  const { rows: idExist } = await connection.query(
    `SELECT * FROM rentals WHERE id = $1`,
    [id]
  );

  if (idExist.length === 1) {
    const gameToReturn = await connection.query(
      `SELECT * FROM rentals WHERE id = $1`,
      [id]
    );

    const { rows: game } = await connection.query(
      `SELECT * FROM games WHERE id = $1`,
      [gameToReturn.rows[0].gameId]
    );

    if (gameToReturn.rows[0].returnDate != null) {
      return res.status(400).send("Jogo já devolvido!");
    }
    const daysRented = gameToReturn.rows[0].daysRented;
    const rentDate = gameToReturn.rows[0].rentDate;
    const returnDate = dayjs().format("YYYY-MM-DD");
    const formatedDate = dayjs(returnDate);

    const differenceDate = formatedDate.diff(rentDate) / 86400000;
    let delayedPrice;

    if (differenceDate > daysRented) {
      const pricePerDay = game[0].pricePerDay;
      const delayedDays = differenceDate - daysRented;

      delayedPrice = pricePerDay * delayedDays;
    } else {
      delayedPrice = null;
    }

    await connection.query(
      `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`,
      [returnDate, delayedPrice, id]
    );

    return res.sendStatus(200);
  }

  return res.sendStatus(404);
}

export async function deleteRentals(req, res) {
  const { id } = req.params;

  const { rows: idExist } = await connection.query(
    `SELECT * FROM rentals WHERE id = $1`,
    [id]
  );
  if (idExist.length === 1) {
    const { rows: isReturnedGame } = await connection.query(
      `SELECT rentals."returnDate" FROM rentals WHERE id = $1`,
      [id]
    );

    if (isReturnedGame[0].returnDate == null) {
      return res.status(400).send("Jogo ainda não devolvido!");
    }

    await connection.query(`DELETE FROM rentals WHERE id = $1`, [id]);
    return res.sendStatus(200);
  }

  res.sendStatus(404);
}
