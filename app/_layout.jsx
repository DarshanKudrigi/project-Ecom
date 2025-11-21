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

  // --- Cart Management Functions ---
  const addToCart = (product) => {
    setCartItems((prev) => {
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

  const increaseQuantity = (productId, productSize) => {
    setCartItems((prev) =>
      prev.map((p) =>
        p.id === productId && p.size === productSize
          ? { ...p, quantity: p.quantity + 1 }
          : p
      )
    );
  };

  const decreaseQuantity = (productId, productSize) => {
    setCartItems((prev) =>
      prev.flatMap((p) => {
        if (p.id === productId && p.size === productSize) {
          if (p.quantity === 1) {
            return [];
          }
          return [{ ...p, quantity: p.quantity - 1 }];
        }
        return p;
      })
    );
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cartItems,
    totalItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#2563eb',
          headerTitleAlign: 'center',
          tabBarStyle: { height: 60, paddingBottom: 5, paddingTop: 5 },
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600' }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesome name="th-large" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: 'Cart',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesome name="shopping-cart" size={20} color={color} />
            ),
            tabBarBadge: totalItems > 0 ? totalItems : undefined,
            tabBarBadgeStyle: { backgroundColor: '#ef4444', color: 'white', fontWeight: 'bold' }
          }}
        />
        <Tabs.Screen
          name="delivery"
          options={{
            title: 'Delivery',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesome name="truck" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="payment"
          options={{
            title: 'Payment',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesome name="credit-card" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user-circle" size={20} color={color} />
            ),
          }}
        />
      </Tabs>
    </CartContext.Provider>
  );
}