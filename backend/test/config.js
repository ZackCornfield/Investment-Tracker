require("dotenv").config();

module.exports = {
  testDbUrl:
    process.env.TEST_DATABASE_URL ||
    process.env.DATABASE_URL.replace("dbname=", "dbname=test_"),
  // Use a separate test database or suffix your main DB
};
