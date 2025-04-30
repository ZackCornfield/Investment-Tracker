exports.up = (pgm) => {
  pgm.createTable("assets", {
    id: { type: "serial", primaryKey: true },
    ticker: { type: "varchar(20)", notNull: true, unique: true },
    name: { type: "varchar(100)", notNull: true },
    asset_type: {
      type: "varchar(50)",
      notNull: true,
      check: "asset_type IN ('STOCK', 'ETF', 'CRYPTO', 'OTHER')",
    },
    currency: { type: "varchar(3)", default: "USD" },
  });

  // Index for ticker searches
  pgm.createIndex("assets", "ticker");
};

exports.down = (pgm) => {
  pgm.dropTable("assets");
};
