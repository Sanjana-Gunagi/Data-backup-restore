const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const backupRoutes = require("./routes/backupRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/backup", backupRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});