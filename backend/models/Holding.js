const db = require("../config/db");

class Holding {
  static async create(portfolioId, assetId, notes = "") {
    const { rows } = await db.query(
      "INSERT INTO holdings (portfolio_id, asset_id, notes) VALUES ($1, $2, $3) RETURNING *",
      [portfolioId, assetId, notes]
    );
    return rows[0];
  }

  static async findByPortfolio(portfolioId) {
    const { rows } = await db.query(
      `SELECT h.*, a.ticker, a.name, a.asset_type, a.currency
       FROM holdings h
       JOIN assets a ON h.asset_id = a.id
       WHERE h.portfolio_id = $1`,
      [portfolioId]
    );
    return rows;
  }

  static async findById(id) {
    const { rows } = await db.query(
      `SELECT h.*, a.ticker, a.name, a.asset_type, a.currency
        FROM holdings h
        JOIN assets a ON a.id = h.asset_id
        WHERE h.id = $1`,
      [id]
    );
    return rows[0];
  }

  static async delete(holdingId) {
    const { rows } = await db.query(
      "DELETE FROM holdings WHERE id = $1 RETURNING *",
      [holdingId]
    );
    return rows[0];
  }
}

module.exports = Holding;
