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

    // Add columns to CartItems
    await client.query(`
      ALTER TABLE "CartItems" ADD COLUMN IF NOT EXISTS "color" VARCHAR(255) NOT NULL DEFAULT '';
      ALTER TABLE "CartItems" ADD COLUMN IF NOT EXISTS "variantInfo" TEXT NOT NULL DEFAULT '{}';
    `);
    console.log('✅ CartItems columns added');

    // Add columns to OrderItems
    await client.query(`
      ALTER TABLE "OrderItems" ADD COLUMN IF NOT EXISTS "color" VARCHAR(255) NOT NULL DEFAULT '';
      ALTER TABLE "OrderItems" ADD COLUMN IF NOT EXISTS "variantInfo" TEXT NOT NULL DEFAULT '{}';
    `);
    console.log('✅ OrderItems columns added');

    // Verify
    const cart = await client.query('SELECT COUNT(*) as count FROM "CartItems"');
    const orders = await client.query('SELECT COUNT(*) as count FROM "OrderItems"');
    console.log(`📦 CartItems: ${cart.rows[0].count}, OrderItems: ${orders.rows[0].count}`);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

migrate();
