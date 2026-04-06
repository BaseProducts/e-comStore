import sequelize from './config/database.js';
import './models/User.js';
import './models/Product.js';
import './models/CartItem.js';

const fixDB = async () => {
  try {
    console.log('Force syncing CartItems table...');
    // This will drop and recreate ONLY this table
    // @ts-ignore
    const CartItem = (await import('./models/CartItem.js')).default;
    await CartItem.sync({ force: true });
    console.log('CartItems table reset successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to reset CartItems table:', error);
    process.exit(1);
  }
};

fixDB();
