import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { BASE_URL } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  imageUrls: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  size: string;
  quantity: number;
  product: Product;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: string, size: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      setIsLoading(true);
      // Add timestamp to query to prevent browser caching (304 issues)
      const res = await fetch(`${BASE_URL}/api/cart?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
      });

      if (res.ok) {
        const result = await res.json();
        setCartItems(result.data || []);
      } else if (res.status === 401) {
        console.warn("Unauthorized request - token may be invalid");
        setCartItems([]);
      } else {
        setCartItems([]);
      }
    } catch {
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const addToCart = async (productId: string, size: string, quantity: number = 1) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, size, quantity }),
      });

      if (res.ok) {
        toast.success('Added to cart!');
        await refreshCart();
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Add to Cart Error:', error);
      toast.error('Network error');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // --- OPTIMISTIC UPDATE ---
    // Update UI instantly
    const previousItems = [...cartItems];
    setCartItems(current => 
      current.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );

    try {
      const res = await fetch(`${BASE_URL}/api/cart/update/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!res.ok) {
        // Rollback on failure
        setCartItems(previousItems);
        const errorData = await res.json();
        toast.error(`${errorData.message || 'Update failed'} (Server Sync Error)`);
      }
      // No need to refresh—the optimistic update is already correct 
      // and we confirmed success with res.ok
    } catch (error: any) {
      console.error('Update Quantity Error:', error);
      setCartItems(previousItems);
      toast.error(`Connection Error: ${error.message || 'Check your internet'}`);
    }
  };

  const removeFromCart = async (itemId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Optimistic remove
    const previousItems = [...cartItems];
    setCartItems(current => current.filter(item => item.id !== itemId));

    try {
      const res = await fetch(`${BASE_URL}/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        setCartItems(previousItems);
        toast.error('Failed to remove item');
      } else {
        toast.success('Removed from cart');
      }
    } catch (error) {
      console.error('Remove Error:', error);
      setCartItems(previousItems);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart,
        clearCart,
        totalItems,
        totalPrice,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
