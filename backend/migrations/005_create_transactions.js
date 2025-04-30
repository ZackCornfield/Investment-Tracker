exports.up = (pgm) => {
  pgm.createTable("transactions", {
    id: { type: "serial", primaryKey: true },
    holding_id: {
      type: "integer",
      notNull: true,
      references: "holdings(id)",
      onDelete: "cascade",
    },
    type: {
      type: "varchar(10)",
      notNull: true,
      check: "type IN ('BUY', 'SELL', 'DIVIDEND', 'SPLIT', 'FEE')",
    },
    date: { type: "date", notNull: true },
    shares: { type: "decimal(15,6)" }, // Nullable for non-trade transactions
    price_per_share: { type: "decimal(15,4)" },
    total_amount: { type: "decimal(15,2)", notNull: true },
    fee: { type: "decimal(15,2)", default: 0 },
    tax: { type: "decimal(15,2)", default: 0 },
    notes: { type: "text" },
    created_at: {
      type: "timestamp with time zone",
      default: pgm.func("current_timestamp"),
    },
  });

  // Indexes for performance
  pgm.createIndex("transactions", "holding_id");
  pgm.createIndex("transactions", "date");
  pgm.createIndex("transactions", ["holding_id", "date"]);
};

exports.down = (pgm) => {
  pgm.dropTable("transactions");
};
