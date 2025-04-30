exports.up = (pgm) => {
  pgm.createTable("holdings", {
    id: { type: "serial", primaryKey: true },
    portfolio_id: {
      type: "integer",
      notNull: true,
      references: "portfolios(id)",
      onDelete: "cascade",
    },
    asset_id: {
      type: "integer",
      notNull: true,
      references: "assets(id)",
      onDelete: "cascade",
    },
    notes: { type: "text" },
  });

  // Unique constraint to prevent duplicate assets in a portfolio
  pgm.addConstraint("holdings", "holdings_portfolio_asset_unique", {
    unique: ["portfolio_id", "asset_id"],
  });

  // Indexes for common queries
  pgm.createIndex("holdings", "portfolio_id");
  pgm.createIndex("holdings", "asset_id");
};

exports.down = (pgm) => {
  pgm.dropTable("holdings");
};
