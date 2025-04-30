const Asset = require("../../models/Asset");
const { setupTestDatabase, seedTestData } = require("../helpers");

describe("Asset Model", () => {
  let testPool;

  beforeAll(async () => {
    testPool = await setupTestDatabase();
    await seedTestData(testPool);
  });

  test("create() inserts a new asset", async () => {
    const asset = await Asset.create({
      ticker: "VAS",
      name: "Vanguard ETF",
      assetType: "ETF",
    });

    const asset2 = await Asset.create({
      ticker: "VGS",
      name: "Vanguard Global",
      assetType: "ETF",
    });

    expect(asset.ticker).toBe("VAS");
    expect(asset.name).toBe("Vanguard ETF");
    expect(asset2.ticker).toBe("VGS");
    expect(asset2.name).toBe("Vanguard Global");
  });

  test("search() finds assets by query", async () => {
    const results = await Asset.search("vanguard");
    expect(results.length).toBe(2);
  });
});
