const db = require("../config/db");
const format = require("pg-format");
const config = require("./config");

async function setupTestDatabase() {
  // Clean and seed test data
  await db.query(`
    TRUNCATE TABLE 
      portfolio_snapshots,
      transactions,
      holdings,
      portfolios,
      assets,
      users
    RESTART IDENTITY CASCADE
  `);

  return db;
}

module.exports = {
  setupTestDatabase,
  seedTestData: async (pool) => {
    await pool.query(
      format(`
      INSERT INTO users (id, email, password_hash, name) 
      VALUES 
        (1, 'test@example.com', 'hash1', 'Test User'),
        (2, 'other@example.com', 'hash2', 'Other User')
    `)
    );

    const portfolios = await pool.query(
      format(`
      INSERT INTO portfolios (user_id, name) 
      VALUES 
        (1, 'Retirement'),
        (1, 'Trading'),
        (2, 'Other User Portfolio')
      RETURNING id
    `)
    );

    const assets = await pool.query(
      format(`
      INSERT INTO assets (ticker, name, asset_type, currency) 
      VALUES 
        ('AAPL', 'Apple Inc.', 'STOCK', 'USD'),
        ('GOOGL', 'Alphabet Inc.', 'STOCK', 'USD')
      RETURNING id
    `)
    );

    return {
      portfolioIds: portfolios.rows.map((row) => row.id), // Return portfolio IDs
      assetIds: assets.rows.map((row) => row.id), // Return asset IDs
    };
  },
};
