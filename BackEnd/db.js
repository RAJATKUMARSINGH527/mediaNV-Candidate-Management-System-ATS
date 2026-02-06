import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Ye check karega ki kya hum localhost par hain
const isLocal = process.env.DATABASE_URL.includes("localhost") || 
                process.env.DATABASE_URL.includes("127.0.0.1");

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  // AGAR LOCAL HAI TOH SSL FALSE, WARNA TRUE (Render ke liye)
  ssl: isLocal ? false : { rejectUnauthorized: false }
};

export const pool = new Pool(poolConfig);

// Connection Test with Logging
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database Connection Error:', err.message);
    console.log('💡 Tip: Make sure your PostgreSQL service is running on port 7777');
  } else {
    console.log('✅ Database Connected Successfully (SSL:', isLocal ? "OFF" : "ON", ')');
    release();
  }
});