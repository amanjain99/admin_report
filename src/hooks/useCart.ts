import { useState, useEffect, useCallback, useRef } from 'react';
import type { QueryResponse, CartItem } from '../types';

const STORAGE_KEY = 'wayground-cart-items';

// Helper function to load from localStorage
function loadFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((item: CartItem) => ({
        ...item,
        addedAt: new Date(item.addedAt),
        response: {
          ...item.response,
          timestamp: new Date(item.response.timestamp),
        },
      }));
    }
  } catch (error) {
    console.error('Failed to load cart items:', error);
  }
  return [];
}

interface UseCartResult {
  cartItems: CartItem[];
  addToCart: (response: QueryResponse) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  cartCount: number;
}

export function useCart(): UseCartResult {
  // Initialize state from localStorage synchronously
  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadFromStorage());
  const isInitialized = useRef(false);

  // Save to localStorage whenever cart items change (but not on initial mount)
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart items:', error);
    }
  }, [cartItems]);

  const addToCart = useCallback((response: QueryResponse) => {
    const newItem: CartItem = {
      id: response.id,
      response,
      addedAt: new Date(),
    };

    setCartItems(prev => {
      // Don't add duplicates
      if (prev.some(item => item.id === response.id)) {
        return prev;
      }
      return [...prev, newItem];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const isInCart = useCallback((id: string) => {
    return cartItems.some(item => item.id === id);
  }, [cartItems]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    cartCount: cartItems.length,
  };
}

