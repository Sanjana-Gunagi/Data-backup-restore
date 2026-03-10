const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadFile,
  getBackups,
  restoreFile
} = require("../controllers/backupController");

router.post("/upload", authMiddleware, upload.single("file"), uploadFile);

router.get("/files", authMiddleware, getBackups);

router.get("/restore/:id", authMiddleware, restoreFile);

module.exports = router;