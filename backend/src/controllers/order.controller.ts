import type { Request, Response } from 'express';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import sequelize from '../config/database.js';

export const createOrder = async (req: Request, res: Response) => {
  const t = await sequelize.transaction();
  try {
    const userId = (req as any).user?.id;
    const { 
      fullName, email, phone, address, city, state, zipCode,
      subtotal, tax, shipping, total, paymentMethod 
    } = req.body;

    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [{ model: Product, as: 'product' }],
      transaction: t
    });

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    const order = await Order.create({
      userId,
      fullName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      subtotal,
      tax: tax || 0,
      shipping: shipping || 0,
      total,
      paymentMethod,
      status: 'pending'
    }, { transaction: t, returning: true });

    // Use get('id') to safely retrieve the generated primary key
    const orderId = order.getDataValue('id') || order.id;
    
    if (!orderId) {
      throw new Error(`Order creation failed - no valid ID returned`);
    }

    const orderItems = (cartItems as any[]).map(item => ({
      orderId,
      productId: item.productId,
      name: item.product.name,
      price: item.product.discountPrice || item.product.price,
      quantity: item.quantity,
      size: item.size,
      image: item.product.imageUrls?.[0] || ''
    }));

    await OrderItem.bulkCreate(orderItems, { transaction: t });

    // Clear cart after successful order
    await CartItem.destroy({ where: { userId }, transaction: t });

    await t.commit();
    res.status(201).json({ status: 'success', message: 'Order created successfully', orderId });
  } catch (error: any) {
    await t.rollback();
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
      // Rule: Stripe is immediate, COD only when delivered
      if (order.paymentMethod === 'stripe') {
        totalEarnings += order.total;
      } else if (order.paymentMethod === 'cod' && order.status === 'delivered') {
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
