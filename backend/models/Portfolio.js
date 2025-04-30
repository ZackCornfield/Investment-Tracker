const db = require("../config/db");

class Portfolio {
  static async create(userId, { name, description = "" }) {
    const { rows } = await db.query(
      "INSERT INTO portfolios (user_id, name, description) VALUES ($1, $2, $3) RETURNING *",
      [userId, name, description]
    );
    return rows[0];
  }

  static async findByUser(userId) {
    const { rows } = await db.query(
      "SELECT * FROM portfolios WHERE user_id = $1",
      [userId]
    );
    return rows;
  }

  static async findById(id, userId) {
    const { rows } = await db.query(
      "SELECT * FROM portfolios WHERE id = $1 AND user_id = $2",
      [id, userId]
    );
    return rows[0];
  }

  static async update(id, userId, { name, description }) {
    const { rows } = await db.query(
      "UPDATE portfolios SET name = $1, description = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [name, description, id, userId]
    );
    return rows[0];
  }

  static async delete(id, userId) {
    const { rows } = await db.query(
      "DELETE FROM portfolios WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    return rows[0];
  }
}

module.exports = Portfolio;
