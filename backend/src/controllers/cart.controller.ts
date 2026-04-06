import type { Request, Response } from 'express';
import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';

// Helper: extract and validate UUID from JWT payload
const getValidUserId = (req: Request): string | null => {
  const userId = (req as any).user?.id;
  return userId ? String(userId) : null;
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = getValidUserId(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Invalid session. Please login again.' });
    }

    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'discountPrice', 'imageUrls'],
        },
      ],
    });

    res.status(200).json({
      status: 'success',
      data: cartItems,
    });
  } catch (error: any) {
    console.error('Fetch Cart Error:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to fetch cart.' });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = getValidUserId(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Invalid session. Please login again.' });
    }

    const { productId, size, quantity = 1 } = req.body;

    if (!productId || !size) {
      return res.status(400).json({ message: 'Product ID and size are required' });
    }

    // Check if the same product and size already exists in the cart
    let cartItem = await CartItem.findOne({
      where: { userId, productId, size },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        userId,
        productId,
        size,
        quantity,
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Product added to cart',
      data: cartItem,
    });
  } catch (error: any) {
    console.error('Add to Cart Error:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to add to cart.' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = getValidUserId(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Invalid session. Please login again.' });
    }

    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    console.log(`Updating CartItem ${id} to quantity ${quantity} for user ${userId}`);
    const [updatedCount] = await CartItem.update(
      { quantity },
      { where: { id, userId } }
    );

    if (updatedCount === 0) {
      console.warn(`No CartItem found with ID ${id} for user ${userId}`);
      return res.status(404).json({ message: 'Cart item not found' });
    }

    console.log(`Successfully updated CartItem ${id} in DB`);

    res.status(200).json({
      status: 'success',
      message: 'Cart item updated',
    });
  } catch (error: any) {
    console.error('Update Cart Error:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to update cart item.' });
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const userId = getValidUserId(req);
    if (!userId) {
      return res.status(401).json({ status: 'error', message: 'Invalid session. Please login again.' });
    }

    const { id } = req.params;

    const cartItem = await CartItem.findOne({
      where: { id, userId },
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartItem.destroy();

    res.status(200).json({
      status: 'success',
      message: 'Cart item removed',
    });
  } catch (error: any) {
    console.error('Remove Cart Error:', error.message);
    res.status(500).json({ status: 'error', message: 'Failed to remove cart item.' });
  }
};
