import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import stripeRoutes from './routes/stripe.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import contactRoutes from './routes/contact.routes.js';
import userRoutes from './routes/user.routes.js';
import cartRoutes from './routes/cart.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import orderRoutes from './routes/order.routes.js';
import './models/CartItem.js';
import './models/Setting.js';
import './models/Order.js';
import './models/OrderItem.js';

// Connect to Database
connectDB();

// Environment Validation
const isProduction = process.env.NODE_ENV === 'production';
console.log(`[Startup Diagnosis] ---------------------------------------`);
console.log(`[Startup Diagnosis] CWD: ${process.cwd()}`);
console.log(`[Startup Diagnosis] Environment: ${process.env.NODE_ENV || 'undefined'}`);
console.log(`[Startup Diagnosis] PORT: ${process.env.PORT || 'using default 5000'}`);
console.log(`[Startup Diagnosis] FRONTEND_URL: ${process.env.FRONTEND_URL ? 'PRESENT' : 'MISSING (ACTION REQUIRED)'}`);
console.log(`[Startup Diagnosis] DATABASE_URL: ${process.env.DATABASE_URL ? 'PRESENT' : 'MISSING (ACTION REQUIRED)'}`);
console.log(`[Startup Diagnosis] ---------------------------------------`);

if (isProduction) {
  if (!process.env.FRONTEND_URL) {
    console.error('❌ CRITICAL ERROR: FRONTEND_URL is missing in production. Checkout WILL FAIL.');
  }
}

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(morgan('dev'));

// Simple Request Logger for debugging connectivity
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Specialized Raw Body Parser for Stripe Webhooks
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Health Check Route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend server is up and running!',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/webhooks', stripeRoutes);
app.use('/api/checkout', stripeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/orders', orderRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

export default app;
