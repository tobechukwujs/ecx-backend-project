require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Add SSL configuration for cloud environments like Render
  ssl: process.env.DATABASE_URL.includes('localhost') 
    ? false 
    : { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};