import type { Request, Response } from 'express';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';

/**
 * Verify a Stripe Checkout Session — called by the frontend success page
 * to confirm that the order was actually created in the DB after payment.
 */
export const verifySession = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ status: 'error', message: 'session_id is required' });
    }

    const order = await Order.findOne({
      where: {
        stripeSessionId: session_id as string,
        userId,
      },
      include: [{ model: OrderItem, as: 'items' }],
    });

    if (!order) {
      // Order might not be created yet (webhook still processing)
      return res.status(404).json({ status: 'pending', message: 'Order not yet confirmed' });
    }

    res.status(200).json({
      status: 'success',
      order: {
        id: order.id,
        total: order.total,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        items: (order as any).items,
      },
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Order.update({ status }, { where: { id } });
    res.status(200).json({ status: 'success', message: 'Order status updated' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll();
    let totalEarnings = 0;
    
    orders.forEach(order => {
      // Only count orders that are actually paid via Stripe
      if (order.paymentStatus === 'paid') {
        totalEarnings += order.total;
      }
    });

    const [totalProducts, totalCustomers, totalCategories] = await Promise.all([
      Product.count(),
      User.count({ where: { role: 'user' } }),
      Category.count()
    ]);

    res.status(200).json({
      totalEarnings,
      totalProducts,
      totalCustomers,
      totalCategories
    });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Order.destroy({ where: { id } });
    res.status(200).json({ status: 'success', message: 'Order removed' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
