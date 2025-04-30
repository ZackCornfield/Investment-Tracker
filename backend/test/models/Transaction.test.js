const Transaction = require("../../models/Transaction");
const { setupTestDatabase, seedTestData } = require("../helpers");

describe("Transaction Model", () => {
  let testPool;
  let assetIds = [];

  beforeAll(async () => {
    testPool = await setupTestDatabase();
    const seedData = await seedTestData(testPool);
    assetIds = seedData.assetIds;

    await testPool.query(`
      INSERT INTO holdings (id, portfolio_id, asset_id) 
      VALUES 
        (1, 1, ${assetIds[0]}),
        (2, 1, ${assetIds[1]})
    `);
  });

  test("create() should record a buy transaction", async () => {
    const tx = await Transaction.create({
      holdingId: 1,
      type: "BUY",
      date: "2023-01-15",
      shares: 10,
      pricePerShare: 98.5,
      totalAmount: 985.0,
    });

    expect(tx.type).toBe("BUY");
    expect(parseFloat(tx.shares)).toBe(10);
  });

  test("findByPortfolio() should return portfolio transactions", async () => {
    await Transaction.create({
      holdingId: 2,
      type: "BUY",
      date: "2023-01-16",
      shares: 5,
      pricePerShare: 120.0,
      totalAmount: 600.0,
    });

    const transactions = await Transaction.findByPortfolio(1);
    expect(transactions.length).toBe(2);
    expect(transactions[0].ticker).toBe("GOOGL");
  });
});
