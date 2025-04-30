const db = require("../../config/db");
const Portfolio = require("../../models/Portfolio");
const { setupTestDatabase, seedTestData } = require("../helpers");

describe("Portfolio Model", () => {
  let testPool;

  beforeAll(async () => {
    testPool = await setupTestDatabase();
    await seedTestData(testPool);
  });

  test("create() should create a new portfolio", async () => {
    const portfolio = await Portfolio.create(1, {
      name: "New Portfolio",
      description: "Test description",
    });

    expect(portfolio.name).toBe("New Portfolio");
    expect(portfolio.user_id).toBe(1);
  });

  test("findByUser() should return user portfolios", async () => {
    const portfolios = await Portfolio.findByUser(1);
    expect(portfolios.length).toBe(3);
    expect(portfolios[0].name).toBe("Retirement");
  });

  test("delete() should remove a portfolio", async () => {
    const { rows } = await db.query(
      `SELECT id from portfolios WHERE user_id = $1`,
      [1]
    );

    const portfolioId = rows[0].id;

    const deleted = await Portfolio.delete(portfolioId, 1);
    expect(deleted.id).toBe(portfolioId);

    const portfolios = await Portfolio.findByUser(1);
    expect(portfolios.length).toBe(2);
  });
});
