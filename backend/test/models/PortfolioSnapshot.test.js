const PortfolioSnapshot = require("../../models/PortfolioSnapshot");
const { setupTestDatabase, seedTestData } = require("../helpers");

describe("PortfolioSnapshot Model", () => {
  let testPool;
  let portfolioIds = [];

  beforeAll(async () => {
    testPool = await setupTestDatabase();
    const seedData = await seedTestData(testPool); // Capture portfolio IDs
    portfolioIds = seedData.portfolioIds;
  });

  test("create() should create a new portfolio snapshot", async () => {
    const snapshot = await PortfolioSnapshot.create(
      portfolioIds[0],
      "2025-04-30",
      100000
    );

    expect(snapshot.portfolio_id).toBe(portfolioIds[0]);
    expect(snapshot.date).toBe("2025-04-30");
    expect(parseInt(snapshot.total_value)).toBe(100000);
  });

  test("findByPortfolio() should return snapshots for a portfolio", async () => {
    await PortfolioSnapshot.create(portfolioIds[0], "2025-04-28", 100000);
    await PortfolioSnapshot.create(portfolioIds[0], "2025-04-27", 95000);

    const snapshots = await PortfolioSnapshot.findByPortfolio(portfolioIds[0]);

    expect(snapshots.length).toBeGreaterThanOrEqual(2);
    expect(snapshots[0]).toHaveProperty("portfolio_id", portfolioIds[0]);
    expect(snapshots[0]).toHaveProperty("date");
    expect(snapshots[0]).toHaveProperty("total_value");
  });

  test("getLatest() should return the latest snapshot for a portfolio", async () => {
    await PortfolioSnapshot.create(portfolioIds[0], "2025-04-26", 90000);
    const latestSnapshot = await PortfolioSnapshot.getLatest(portfolioIds[0]);

    expect(latestSnapshot.portfolio_id).toBe(portfolioIds[0]);
    expect(latestSnapshot.date).toBe("2025-04-30");
    expect(parseInt(latestSnapshot.total_value)).toBe(100000);
  });
});
