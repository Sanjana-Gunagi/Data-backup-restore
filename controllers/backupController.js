const db = require("../config/db");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const algorithm = "aes-256-cbc";
const secretKey = process.env.SECRET_KEY || "mysecretkey";

function encryptFile(buffer) {

  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    algorithm,
    crypto.createHash("sha256").update(secretKey).digest(),
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(buffer),
    cipher.final()
  ]);

  return {
    iv: iv.toString("hex"),
    content: encrypted
  };

}

function decryptFile(encryptedBuffer, ivHex) {

  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(
    algorithm,
    crypto.createHash("sha256").update(secretKey).digest(),
    iv
  );

  const decrypted = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final()
  ]);

  return decrypted;

}

exports.uploadFile = (req, res) => {

  const userId = req.user.id;
  const file = req.file;

  const fileBuffer = fs.readFileSync(file.path);
const encryptedData = encryptFile(fileBuffer);

fs.writeFileSync(file.path, encryptedData.content);

  // Generate SHA256 hash
  const hash = crypto
    .createHash("sha256")
    .update(fileBuffer)
    .digest("hex");

  db.query(
    "SELECT * FROM backups WHERE user_id = ? AND filename = ? ORDER BY version DESC LIMIT 1",
    [userId, file.originalname],
    (err, result) => {

      if (err) return res.status(500).json(err);

      // Check duplicate
      if (result.length > 0 && result[0].file_hash === hash) {
        fs.unlinkSync(file.path);
        return res.json({ message: "No changes detected. Backup skipped." });
      }

      const newVersion = result.length > 0 ? result[0].version + 1 : 1;

      db.query(
        "INSERT INTO backups (user_id, filename, filepath, file_hash, version) VALUES (?, ?, ?, ?, ?)",
        [userId, file.originalname, file.path, hash, newVersion],
        (err2) => {

          if (err2) return res.status(500).json(err2);

          res.json({
            message: "File backed up successfully",
            version: newVersion
          });

        }
      );

    }
  );

};


exports.getBackups = (req, res) => {

  db.query(
    "SELECT * FROM backups WHERE user_id = ?",
    [req.user.id],
    (err, result) => {

      if (err) return res.status(500).json(err);

      res.json(result);

    }
  );

};


exports.restoreFile = (req, res) => {

  const backupId = req.params.id;

  db.query(
    "SELECT * FROM backups WHERE id = ? AND user_id = ?",
    [backupId, req.user.id],
    (err, result) => {

      if (err) return res.status(500).json(err);

      if (result.length === 0)
        return res.status(404).json({ message: "Backup not found" });

      const relativePath = result[0].filepath;

      const absolutePath = path.join(__dirname, "..", relativePath);

      if (!fs.existsSync(absolutePath)) {
        return res.status(404).json({ message: "File not found on server" });
      }

      const encryptedBuffer = fs.readFileSync(absolutePath);

const decryptedBuffer = decryptFile(
  encryptedBuffer,
  result[0].iv
);

res.setHeader(
  "Content-Disposition",
  "attachment; filename=" + result[0].filename
);

res.send(decryptedBuffer);
    }
  );

};