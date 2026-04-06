import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbPort = parseInt(process.env.DB_PORT || '5432');

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: (msg) => {
    if (msg.includes('ERROR') || msg.includes('Failed')) {
      console.error('DB_LOG: ', msg);
    }
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Required for Supabase
    },
  },
  pool: {
    max: 10, // Increased pool size
    min: 2,
    acquire: 60000, 
    idle: 30000,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to Supabase PostgreSQL has been established successfully.');
    
    // Ensure CartItems table exists via raw SQL (bypasses Sequelize constraint issues)
    try {
      await sequelize.query(`
        DROP TABLE IF EXISTS "Settings" CASCADE;
        CREATE TABLE "Settings" (
          "key" VARCHAR(255) PRIMARY KEY,
          "value" TEXT NOT NULL,
          "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS "Orders" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "userId" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          "fullName" VARCHAR(255) NOT NULL,
          "email" VARCHAR(255) NOT NULL,
          "phone" VARCHAR(255) NOT NULL,
          "address" TEXT NOT NULL,
          "city" VARCHAR(255) NOT NULL,
          "state" VARCHAR(255) NOT NULL,
          "zipCode" VARCHAR(20) NOT NULL,
          "subtotal" FLOAT NOT NULL,
          "tax" FLOAT NOT NULL,
          "shipping" FLOAT NOT NULL,
          "total" FLOAT NOT NULL,
          "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
          "paymentMethod" VARCHAR(50) NOT NULL,
          "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS "OrderItems" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "orderId" UUID NOT NULL REFERENCES "Orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          "productId" UUID NOT NULL REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE,
          "name" VARCHAR(255) NOT NULL,
          "price" FLOAT NOT NULL,
          "quantity" INTEGER NOT NULL,
          "size" VARCHAR(50) NOT NULL,
          "image" TEXT NOT NULL,
          "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);
      console.log('E-commerce tables ensured.');
    } catch (cartTableError: any) {
      console.error('CartItems table creation note:', cartTableError.message);
    }

    // Sync other models (safe sync - won't fail on existing tables)
    try {
      await sequelize.sync({ alter: true });
      console.log('Database synchronization complete.');
    } catch (syncError: any) {
      // If alter fails (constraint issues), try plain sync as fallback
      console.warn('Alter sync failed, trying plain sync:', syncError.message);
      try {
        await sequelize.sync();
        console.log('Database synchronization complete (plain sync).');
      } catch (plainSyncError: any) {
        console.error('Plain sync also failed:', plainSyncError.message);
      }
    }
  } catch (error: any) {
    console.error('Unable to connect to the database:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

export default sequelize;
