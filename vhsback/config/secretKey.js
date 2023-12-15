// In a separate file, e.g., secretKey.js
const fs = require("fs");
const path = require("path");

const secretKeyPath = path.join(__dirname, "secretKey.js");
const SECRET_KEY = fs.readFileSync(secretKeyPath, "utf8").trim();

module.exports = { SECRET_KEY };
