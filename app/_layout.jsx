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

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const clearCart = () => setCartItems([]);

  const value = {
    cartItems,
    addToCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: 'blue',
          headerTitleAlign: 'center',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="th-large" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: 'Cart',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="shopping-cart" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="payment"
          options={{
            title: 'payment',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="money" size={24} color="black" />
            ),
          }}
        />
        <Tabs.Screen
          name="delivery"
          options={{
            title: 'Delivery',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="check-circle" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </CartContext.Provider>
  );
}
