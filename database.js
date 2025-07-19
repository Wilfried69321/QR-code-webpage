// Load environment variables from a .env file (only in development)
require("dotenv").config();

// Import mysql2 for connection pooling
const { createPool } = require("mysql2");

// Create a MySQL connection pool using .env values or safe local fallbacks
const pool = createPool({
  host: process.env.DB_HOST || "turntable.proxy.rlwy.net",
  port: parseInt(process.env.DB_PORT, 10) || 48227,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "EGNIRrEHOJXyEjBElsEiInTmsKPZsoiT",
  database: process.env.DB_NAME || "ticket",
  connectionLimit: 10,
});

// Optional: Log a simple connection check (remove this in production if needed)
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Failed to connect to the database:", err.message);
  } else {
    console.log("✅ Connected to MySQL database.");
    connection.release();
  }
});

// Export the pool to be used in other files (like server.js)
module.exports = pool;
