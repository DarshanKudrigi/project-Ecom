import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from './_layout';

export default function CartScreen() {
  const { cartItems } = useCart();
  const router = useRouter();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>
          Your cart is empty. Go to Home and add some items.
        </Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={styles.left}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.qty}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.price}>
                  ₹{item.price * item.quantity}
                </Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />

          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>₹{total}</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/product')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Proceed to Shipping</Text>
          </TouchableOpacity>
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
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  left: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  qty: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  totalRow: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
