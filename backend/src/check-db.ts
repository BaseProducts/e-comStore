import Product from './models/Product.js';
import { connectDB } from './config/database.js';

async function checkProducts() {
  await connectDB();
  const count = await Product.count();
  console.log('Total Products:', count);
  const products = await Product.findAll();
  console.log('Products:', JSON.stringify(products, null, 2));
  process.exit(0);
}

checkProducts().catch(err => {
  console.error(err);
  process.exit(1);
});
