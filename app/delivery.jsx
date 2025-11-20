import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCart } from './_layout';

export default function ProductShippingScreen() {
  const { cartItems } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const itemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order & Shipping Details</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.text}>
          You don’t have any active order yet. Add items to cart and checkout.
        </Text>
      ) : (
        <>
          <Text style={styles.status}>Status: Preparing for shipment 🚚</Text>

          <View style={styles.box}>
            <Text style={styles.label}>Total items:</Text>
            <Text style={styles.value}>{itemCount}</Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.label}>Order amount:</Text>
            <Text style={styles.value}>₹{total}</Text>
          </View>

          <Text style={styles.note}>
            Thank you for shopping with EasyBuy. Your products will be shipped
            soon. You can track your cart and orders from the bottom tabs.
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },
  text: {
    fontSize: 15,
    color: '#6b7280',
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2563eb',
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    color: '#374151',
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  note: {
    marginTop: 16,
    fontSize: 14,
    color: '#6b7280',
  },
});