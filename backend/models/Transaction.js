const db = require("../config/db");

class Transaction {
  static async create({
    holdingId,
    type,
    date,
    shares,
    pricePerShare,
    totalAmount,
    fee = 0,
    tax = 0,
    notes = "",
  }) {
    const { rows } = await db.query(
      `INSERT INTO transactions (
            holding_id, type, date, shares, price_per_share, 
            total_amount, fee, tax, notes
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        holdingId,
        type,
        date,
        shares,
        pricePerShare,
        totalAmount,
        fee,
        tax,
        notes,
      ]
    );
    return rows[0];
  }

  static async findByHolding(holdingId) {
    const { rows } = await db.query(
      `SELECT * FROM transaction WHERE holding_id = $1`,
      [holdingId]
    );
    return rows;
  }

  static async findByPortfolio(portfolioId) {
    const { rows } = await db.query(
      `SELECT t.*, a.ticker, a.name
        FROM transactions t
        JOIN holdings h on t.holding_id = h.id
        JOIN assets a ON h.asset_id = a.id
        WHERE h.portfolio_id = $1 
        ORDER BY t.date DESC`,
      [portfolioId]
    );
    return rows;
  }

  static async delete(transactionId) {
    const { rows } = await db.query(
      `DELETE FROM transactions WHERE id = $1 RETURNING *`,
      [transactionId]
    );
    return rows[0];
  }
}

module.exports = Transaction;
