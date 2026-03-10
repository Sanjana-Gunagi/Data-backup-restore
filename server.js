const express = require("express");
const app = express();

const authRoutes = require("./routes/authRoutes");
const backupRoutes = require("./routes/backupRoutes");

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/backup", backupRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});