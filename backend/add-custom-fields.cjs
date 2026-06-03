const { Client } = require('pg');
require('dotenv').config();

async function migrate() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to database');

    await client.query(`
      ALTER TABLE "Products"
      ADD COLUMN IF NOT EXISTS "customFields" JSON DEFAULT '[]' NOT NULL
    `);

    console.log('✅ customFields column added successfully');

    // Verify products still exist
    const result = await client.query('SELECT COUNT(*) as count FROM "Products"');
    console.log(`📦 Products in database: ${result.rows[0].count}`);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

migrate();
