exports.up = (pgm) => {
  pgm.createTable("portfolio_snapshots", {
    id: { type: "serial", primaryKey: true },
    portfolio_id: {
      type: "integer",
      notNull: true,
      references: "portfolios(id)",
      onDelete: "cascade",
    },
    date: { type: "date", notNull: true },
    total_value: { type: "decimal(15,2)", notNull: true },
  });

  // Ensure one snapshot per portfolio per day
  pgm.addConstraint("portfolio_snapshots", "portfolio_snapshots_unique", {
    unique: ["portfolio_id", "date"],
  });

  // Index for time-series queries
  pgm.createIndex("portfolio_snapshots", ["portfolio_id", "date"]);
};

exports.down = (pgm) => {
  pgm.dropTable("portfolio_snapshots");
};
