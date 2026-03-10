CREATE DATABASE backup_system;

USE backup_system;

CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50),
email VARCHAR(100),
password VARCHAR(255)
);

CREATE TABLE backups (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
filename VARCHAR(255),
file_hash VARCHAR(255),
version INT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);