const db = require("../config/db");

class Asset {
  static async create({ ticker, name, assetType, currency = "USD" }) {
    const { rows } = await db.query(
      "INSERT INTO assets (ticker, name, asset_type, currency) VALUES ($1, $2, $3, $4) RETURNING *",
      [ticker, name, assetType, currency]
    );
    return rows[0];
  }

  static async findByTicker(ticker) {
    const { rows } = await db.query("SELECT * FROM assets WHERE ticker = $1", [
      ticker,
    ]);
    return rows[0];
  }

  static async search(query) {
    const { rows } = await db.query(
      `SELECT * FROM assets 
       WHERE ticker ILIKE $1 OR name ILIKE $1 
       LIMIT 10`,
      [`%${query}%`]
    );
    return rows;
  }
}

module.exports = Asset;
