const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  uploadFile,
  getBackups,
  restoreFile
} = require("../controllers/backupController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadFile);
router.get("/files", getBackups);
router.get("/restore/:id", restoreFile);

module.exports = router;