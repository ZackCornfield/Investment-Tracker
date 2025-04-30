const Holding = require("../../models/Holding");
const { setupTestDatabase, seedTestData } = require("../helpers");

// filepath: h:\Coding\Investment-Tracker\backend\test\models\Holding.test.js

describe("Holding Model", () => {
  let testPool;
  let portfolioIds = [];
  let assetIds = [];

  beforeAll(async () => {
    testPool = await setupTestDatabase();
    const seedData = await seedTestData(testPool); // Capture portfolio and asset IDs
    portfolioIds = seedData.portfolioIds;
    assetIds = seedData.assetIds;
  });

  test("create() should create a new holding", async () => {
    const holding = await Holding.create(
      portfolioIds[0],
      assetIds[0],
      "Test notes"
    );

    expect(holding.portfolio_id).toBe(portfolioIds[0]);
    expect(holding.asset_id).toBe(assetIds[0]);
    expect(holding.notes).toBe("Test notes");
  });

  test("findByPortfolio() should return holdings for a portfolio", async () => {
    const holdings = await Holding.findByPortfolio(portfolioIds[0]);

    expect(holdings.length).toBeGreaterThan(0);
    expect(holdings[0]).toHaveProperty("ticker");
    expect(holdings[0]).toHaveProperty("name");
  });

  test("findById() should return a holding by its ID", async () => {
    const holding = await Holding.create(
      portfolioIds[1],
      assetIds[0],
      "Test notes"
    );
    const fetchedHolding = await Holding.findById(holding.id);

    expect(fetchedHolding.id).toBe(holding.id);
    expect(fetchedHolding.notes).toBe("Test notes");
  });

  test("delete() should remove a holding", async () => {
    const holding = await Holding.create(
      portfolioIds[0],
      assetIds[1],
      "Test notes"
    );
    const deletedHolding = await Holding.delete(holding.id);

    expect(deletedHolding.id).toBe(holding.id);

    const holdings = await Holding.findByPortfolio(portfolioIds[0]);
    const holdingExists = holdings.some((h) => h.id === holding.id);
    expect(holdingExists).toBe(false);
  });
});
