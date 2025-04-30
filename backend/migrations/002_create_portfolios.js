exports.up = (pgm) => {
  pgm.createTable("portfolios", {
    id: { type: "serial", primaryKey: true },
    user_id: {
      type: "integer",
      notNull: true,
      references: "users(id)",
      onDelete: "cascade",
    },
    name: { type: "varchar(100)", notNull: true },
    description: { type: "text" },
    created_at: {
      type: "timestamp with time zone",
      default: pgm.func("current_timestamp"),
    },
  });

  // Index for faster user portfolio queries
  pgm.createIndex("portfolios", "user_id");
};

exports.down = (pgm) => {
  pgm.dropTable("portfolios");
};
