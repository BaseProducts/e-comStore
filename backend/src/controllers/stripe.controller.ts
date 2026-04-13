import Stripe from 'stripe';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';
import sequelize from '../config/database.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * Creates a Stripe Checkout Session.
 * - Validates user's cart from DB (uses real server-side prices, not client-sent)
 * - Stores shipping info in Stripe metadata so the webhook can create the order
 * - Returns the Stripe Checkout URL for frontend redirect
 */
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { fullName, email, phone, address, city, state, zipCode } = req.body;

    // Validate required shipping fields
    if (!fullName || !email || !phone || !address || !city || !state || !zipCode) {
      return res.status(400).json({ message: 'All shipping fields are required' });
    }

    // Fetch cart items from DB with product details (server-side source of truth)
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [{ model: Product, as: 'product' }],
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // Build Stripe line_items from actual DB product prices
    const lineItems: any[] = (cartItems as any[]).map(item => {
      const unitPrice = item.product.discountPrice || item.product.price;
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            images: item.product.imageUrls?.slice(0, 1) || [],
          },
          unit_amount: Math.round(unitPrice * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      };
    });

    // Calculate server-side total for metadata
    const serverTotal = (cartItems as any[]).reduce((sum, item) => {
      const price = item.product.discountPrice || item.product.price;
      return sum + price * item.quantity;
    }, 0);

    let frontendUrl = process.env.FRONTEND_URL;

    // Production Safeguard: Never fall back to localhost in production
    if (process.env.NODE_ENV === 'production') {
      if (!frontendUrl || frontendUrl.includes('localhost') || frontendUrl.includes('127.0.0.1')) {
        console.error('❌ CRITICAL: FRONTEND_URL is missing or set to localhost in production environment!');
        throw new Error('Server configuration error: FRONTEND_URL must be set to the deployed URL in production.');
      }
    } else {
      // Development fallback
      frontendUrl = frontendUrl || 'http://localhost:5173';
    }

    console.log(`[Stripe] Creating checkout session. Redirecting to: ${frontendUrl}`);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: email,
      metadata: {
        userId,
        fullName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        serverTotal: serverTotal.toString(),
      },
      success_url: `${frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout`,
    });

    res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe session creation error:', error.message);
    res.status(500).json({ message: 'Failed to create checkout session', error: error.message });
  }
};

/**
 * Stripe Webhook Handler.
 * - Verifies webhook signature to prevent spoofing
 * - On checkout.session.completed: creates Order + OrderItems in DB, clears cart
 * - This is the ONLY way orders get created — ensures payment is real
 */
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  // Log incoming webhook for debugging
  console.log(`[Stripe Webhook] Received event: ${req.headers['stripe-signature'] ? 'Has Signature' : 'No Signature'}`);

  let event: Stripe.Event;

  try {
    if (!sig || Array.isArray(sig) || !endpointSecret) {
      console.error('❌ Missing signature or webhook secret');
      throw new Error('Missing or invalid stripe-signature or webhook secret');
    }

    // req.body is raw Buffer here (thanks to express.raw middleware in server.ts)
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log(`[Stripe Webhook] Event Type: ${event.type}`);
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`✅ [Stripe Webhook] Received checkout.session.completed: ${session.id}`);

      // Log metadata presence
      if (!session.metadata) {
        console.error('❌ [Stripe Webhook] No metadata found in session');
        break;
      }
      console.log(`[Stripe Webhook] Metadata summary: userId=${session.metadata.userId}, email=${session.metadata.email}`);

      // Prevent duplicate order creation (idempotency)
      const existingOrder = await Order.findOne({ where: { stripeSessionId: session.id } });
      if (existingOrder) {
        console.log(`⚠️ Order already exists for session ${session.id}, skipping`);
        break;
      }

      const t = await sequelize.transaction();
      try {
        const meta = session.metadata || {};
        const userId = meta.userId;

        if (!userId) {
          console.error('❌ No userId in session metadata');
          await t.rollback();
          break;
        }

        // Fetch cart items for this user
        const cartItems = await CartItem.findAll({
          where: { userId },
          include: [{ model: Product, as: 'product' }],
          transaction: t,
        });

        if (cartItems.length === 0) {
          console.error('❌ Cart is empty for user', userId);
          await t.rollback();
          break;
        }

        // Calculate total from server-side prices
        const subtotal = (cartItems as any[]).reduce((sum, item) => {
          const price = item.product.discountPrice || item.product.price;
          return sum + price * item.quantity;
        }, 0);

        // Create the order
        const order = await Order.create({
          userId,
          fullName: meta.fullName || '',
          email: meta.email || '',
          phone: meta.phone || '',
          address: meta.address || '',
          city: meta.city || '',
          state: meta.state || '',
          zipCode: meta.zipCode || '',
          subtotal,
          tax: 0,
          shipping: 0,
          total: subtotal,
          paymentMethod: 'stripe',
          paymentStatus: 'paid',
          stripeSessionId: session.id,
          stripePaymentIntentId: (session.payment_intent as string) || null,
          status: 'pending',
        }, { transaction: t, returning: true });

        const orderId = order.getDataValue('id') || order.id;

        if (!orderId) {
          throw new Error('Order creation failed — no valid ID returned');
        }

        // Create order items
        const orderItems = (cartItems as any[]).map(item => ({
          orderId,
          productId: item.productId,
          name: item.product.name,
          price: item.product.discountPrice || item.product.price,
          quantity: item.quantity,
          size: item.size,
          image: item.product.imageUrls?.[0] || '',
        }));

        await OrderItem.bulkCreate(orderItems, { transaction: t });

        // Clear the user's cart
        await CartItem.destroy({ where: { userId }, transaction: t });

        await t.commit();
        console.log(`✅ [Stripe Webhook] Order ${orderId} successfully created for session ${session.id}`);
      } catch (dbError: any) {
        if (t) await t.rollback();
        console.error('❌ [Stripe Webhook] Database error during order creation:', dbError.message);
        console.error(dbError.stack);
      }
      break;
    }

    case 'checkout.session.expired': {
      const expiredSession = event.data.object as Stripe.Checkout.Session;
      console.log(`⏰ Checkout session expired: ${expiredSession.id}`);
      // No order was created, nothing to clean up
      break;
    }

    case 'payment_intent.payment_failed': {
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`❌ PaymentIntent failed: ${failedPaymentIntent.id}`);
      break;
    }

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  // Return 200 to acknowledge receipt
  res.status(200).json({ received: true });
};
