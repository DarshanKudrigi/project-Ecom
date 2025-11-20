import React, { createContext, useContext, useState } from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// ---- CART CONTEXT (shared for all screens) ----
const CartContext = createContext(null);

export const useCart = () => {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error('useCart must be used inside CartContext.Provider');
  }
  return value;
};

export default function TabLayout() {
  const [cartItems, setCartItems] = useState([]);

  // Add new item or increase quantity of existing item
  const addToCart = (product) => {
    setCartItems((prev) => {
      // Find item that matches both ID and SIZE (for clothing)
      const existing = prev.find((p) => 
        p.id === product.id && p.size === product.size
      );

      if (existing) {
        return prev.map((p) =>
          p.id === product.id && p.size === product.size
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Increase quantity of an existing item by 1
  const increaseQuantity = (productId, productSize) => {
    setCartItems((prev) =>
      prev.map((p) =>
        p.id === productId && p.size === productSize
          ? { ...p, quantity: p.quantity + 1 }
          : p
      )
    );
  };

  // Decrease quantity of an existing item by 1, or remove it if quantity is 1
  const decreaseQuantity = (productId, productSize) => {
    setCartItems((prev) =>
      prev.flatMap((p) => {
        if (p.id === productId && p.size === productSize) {
          // If quantity is 1, remove the item (flatMap removes null/undefined)
          if (p.quantity === 1) {
            return [];
          }
          // Otherwise, decrease quantity
          return [{ ...p, quantity: p.quantity - 1 }];
        }
        return p; // Keep other items unchanged
      })
    );
  };

  const clearCart = () => setCartItems([]);

  // Calculate the total number of items (not quantity) for the cart badge/bar
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cartItems,
    totalItems, // Exporting totalItems for use in other components like HomeScreen
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#2563eb', // Use a stylish blue
          headerTitleAlign: 'center',
          tabBarStyle: { height: 60, paddingBottom: 5, paddingTop: 5 },
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600' }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="th-large" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: 'Cart',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="shopping-cart" size={20} color={color} />
            ),
            // Show a badge with the total number of items
            tabBarBadge: totalItems > 0 ? totalItems : undefined,
            tabBarBadgeStyle: { backgroundColor: '#ef4444', color: 'white', fontWeight: 'bold' }
          }}
        />
        <Tabs.Screen
          name="payment"
          options={{
            title: 'Payment',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="money" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="delivery"
          options={{
            title: 'Delivery',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="check-circle" size={20} color={color} />
            ),
          }}
        />
      </Tabs>
    </CartContext.Provider>
  );
}