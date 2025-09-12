'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  merchant: string;
  quantity: number;
  category: string;
}

export interface CartHook {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  tax: number;
  shipping: number;
  addItem: (product: any, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

const CART_STORAGE_KEY = 'kelo_cart';
const TAX_RATE = 0.16; // 16% VAT in Kenya
const FREE_SHIPPING_THRESHOLD = 5000; // Free shipping over KES 5,000
const SHIPPING_COST = 500; // KES 500 shipping fee

export function useCart(): CartHook {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  /**
   * Load cart data from localStorage when component mounts
   * Handles potential JSON parsing errors gracefully
   */
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    setMounted(true);
  }, []);

  /**
   * Save cart data to localStorage whenever items change
   * Only saves after initial mount to avoid hydration issues
   */
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [items, mounted]);

  /**
   * Calculate cart totals including subtotal, tax, shipping, and final total
   * Tax rate: 16% VAT (Kenya standard)
   * Free shipping threshold: KES 5,000
   */
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const totalPrice = subtotal + tax + shipping;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  /**
   * Add item to cart or update quantity if item already exists
   */
  const addItem = useCallback((product: any, quantity: number = 1) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          merchant: product.merchant,
          quantity,
          category: product.category,
        };
        return [...currentItems, newItem];
      }
    });
  }, []);

  /**
   * Remove item completely from cart
   */
  const removeItem = useCallback((productId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== productId));
  }, []);

  /**
   * Update quantity of specific item
   * Removes item if quantity is 0 or less
   */
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  /**
   * Check if specific product is in cart
   */
  const isInCart = useCallback((productId: string) => {
    return items.some(item => item.id === productId);
  }, [items]);

  /**
   * Get quantity of specific item in cart
   * Returns 0 if item not found
   */
  const getItemQuantity = useCallback((productId: string) => {
    const item = items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }, [items]);

  return {
    items,
    totalItems,
    totalPrice,
    subtotal,
    tax,
    shipping,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };
}