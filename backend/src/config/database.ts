import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// ✅ Use DATABASE_URL instead of individual DB vars
const databaseUrl = process.env.DATABASE_URL as string;

if (!databaseUrl) {
  console.error("❌ DATABASE_URL is not defined in environment variables");
  process.exit(1);
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: (msg) => {
    if (msg.includes('ERROR') || msg.includes('Failed')) {
      console.error('DB_LOG: ', msg);
    }
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // required for Supabase
    },
  },
  pool: {
    max: 10,
    min: 2,
    acquire: 60000,
    idle: 30000,
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Supabase PostgreSQL');

    // ✅ SAFE TABLE CREATION (no destructive drop)
    try {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS "Settings" (
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

      console.log('✅ E-commerce tables ensured');
    } catch (tableError: any) {
      console.error('⚠️ Table creation issue:', tableError.message);
    }

    // ✅ Sync models
    try {
      await sequelize.sync({ alter: true });
      console.log('✅ Database synchronization complete');
    } catch (syncError: any) {
      console.warn('⚠️ Alter sync failed, trying plain sync:', syncError.message);
      try {
        await sequelize.sync();
        console.log('✅ Database synchronization complete (plain sync)');
      } catch (plainSyncError: any) {
        console.error('❌ Plain sync failed:', plainSyncError.message);
      }
    }

  } catch (error: any) {
    console.error('❌ Unable to connect to the database:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

export default sequelize;