const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth");
const investmentsRouter = require("./routes/investments");
const authenticate = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

// Public routes
app.use("/api/auth", authRouter);

// Protected routes
app.use("/api/investments", authenticate, investmentsRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
