Secure Data Backup and Recovery System

Project Description

This project is a backend system that allows users to securely upload, store, and restore files.

The system provides:

- User authentication
- Secure file upload
- File hashing for duplicate detection
- File encryption
- Backup version control
- File recovery

Technologies Used

- Node.js
- Express.js
- MySQL
- JWT Authentication
- AES Encryption

How to Run the Project

1. Install Node.js
2. Install dependencies

npm install

3. Run server

node server.js

4. Import database using "database.sql"

API Endpoints

POST /api/auth/register
POST /api/auth/login
POST /api/backup/upload
GET /api/backup/files
GET /api/backup/restore/:id