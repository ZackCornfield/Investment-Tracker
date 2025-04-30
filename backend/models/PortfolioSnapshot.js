const db = require("../config/db");

class PortfolioSnapShot {
  static async create(portfolioId, dateString, totalValue) {
    // Convert input date to UTC at midnight to avoid timezone issues
    const utcDate = new Date(dateString);
    utcDate.setUTCHours(0, 0, 0, 0);
    const dateForDb = utcDate.toISOString().split("T")[0];

    const { rows } = await db.query(
      `INSERT INTO portfolio_snapshots (portfolio_id, date, total_value)
       VALUES ($1, $2, $3) RETURNING id, portfolio_id, date::text, total_value`,
      [portfolioId, dateForDb, totalValue]
    );

    return rows[0];
  }

  static async findByPortfolio(portfolioId, limit = 30) {
    const { rows } = await db.query(
      `SELECT id, portfolio_id, date::text, total_value
       FROM portfolio_snapshots
       WHERE portfolio_id = $1
       ORDER BY date DESC 
       LIMIT $2`,
      [portfolioId, limit]
    );
    return rows;
  }

  static async getLatest(portfolioId) {
    const { rows } = await db.query(
      `SELECT id, portfolio_id, date::text, total_value
       FROM portfolio_snapshots
       WHERE portfolio_id = $1
       ORDER BY date DESC
       LIMIT 1`,
      [portfolioId]
    );
    return rows[0];
  }
}

module.exports = PortfolioSnapShot;
