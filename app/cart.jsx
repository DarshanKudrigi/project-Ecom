import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useCart } from './_layout'; // Import updated useCart

// Component for individual item in the cart
const CartItem = ({ item, increaseQuantity, decreaseQuantity }) => (
  <View style={cartStyles.cartItem}>
    <View style={cartStyles.itemDetails}>
      <Text style={cartStyles.name} numberOfLines={2}>
        {item.name}
        {item.size && <Text style={cartStyles.sizeText}> - Size: {item.size}</Text>}
      </Text>
      <Text style={cartStyles.pricePerUnit}>
        @ ₹{item.price.toLocaleString('en-IN')}
      </Text>
    </View>

    <View style={cartStyles.quantityControls}>
      <TouchableOpacity
        style={cartStyles.qtyButton}
        onPress={() => decreaseQuantity(item.id, item.size)}
        activeOpacity={0.7}
      >
        <FontAwesome name="minus" size={14} color="#ef4444" />
      </TouchableOpacity>

      <Text style={cartStyles.qtyCount}>{item.quantity}</Text>

      <TouchableOpacity
        style={cartStyles.qtyButton}
        onPress={() => increaseQuantity(item.id, item.size)}
        activeOpacity={0.7}
      >
        <FontAwesome name="plus" size={14} color="#2563eb" />
      </TouchableOpacity>
    </View>

    <Text style={cartStyles.itemTotalPrice}>
      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
    </Text>
  </View>
);

export default function CartScreen() {
  const { cartItems, increaseQuantity, decreaseQuantity } = useCart();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0); // Placeholder for discount amount

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  
  // Final total after applying a discount (placeholder logic)
  const finalTotal = subtotal - discount;

  const handleApplyCoupon = () => {
    // Placeholder logic for coupon application
    if (couponCode.toUpperCase() === 'FLAT100') {
      setDiscount(100);
      alert('Coupon applied: ₹100 discount!');
    } else {
      setDiscount(0);
      alert('Invalid Coupon Code');
    }
  };

  const renderFooter = () => (
    <View style={cartStyles.footer}>
      {/* --- Coupon Code Section --- */}
      <View style={cartStyles.couponSection}>
        <Text style={cartStyles.sectionHeader}>Apply Coupon</Text>
        <View style={cartStyles.couponInputRow}>
          <TextInput
            style={cartStyles.couponInput}
            placeholder="Enter coupon code"
            placeholderTextColor="#9ca3af"
            value={couponCode}
            onChangeText={setCouponCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={cartStyles.couponButton}
            onPress={handleApplyCoupon}
            activeOpacity={0.8}
            disabled={!couponCode}
          >
            <Text style={cartStyles.couponButtonText}>APPLY</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- Price Summary --- */}
      <View style={cartStyles.summaryCard}>
        <Text style={cartStyles.sectionHeader}>Price Details</Text>

        <View style={cartStyles.summaryRow}>
          <Text style={cartStyles.summaryText}>Subtotal</Text>
          <Text style={cartStyles.summaryAmount}>₹{subtotal.toLocaleString('en-IN')}</Text>
        </View>

        <View style={cartStyles.summaryRow}>
          <Text style={[cartStyles.summaryText, cartStyles.discountText]}>Coupon Discount</Text>
          <Text style={[cartStyles.summaryAmount, cartStyles.discountAmount]}>- ₹{discount.toLocaleString('en-IN')}</Text>
        </View>

        <View style={cartStyles.totalRow}>
          <Text style={cartStyles.totalText}>Total Amount</Text>
          <Text style={cartStyles.totalAmount}>₹{finalTotal.toLocaleString('en-IN')}</Text>
        </View>
      </View>

      {/* --- Checkout Button --- */}
      <TouchableOpacity
        style={cartStyles.button}
        onPress={() => router.push('/payment')} // Changed to payment
        activeOpacity={0.8}
      >
        <Text style={cartStyles.buttonText}>Proceed to Checkout (₹{finalTotal.toLocaleString('en-IN')})</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={cartStyles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} // Adjust based on your header height
    >
      <Text style={cartStyles.title}>Your Shopping Cart</Text>

      {cartItems.length === 0 ? (
        <View style={cartStyles.emptyContainer}>
          <FontAwesome name="shopping-cart" size={60} color="#e5e7eb" style={{marginBottom: 10}}/>
          <Text style={cartStyles.emptyText}>
            Your cart is empty.
          </Text>
          <TouchableOpacity 
            style={cartStyles.backButton} 
            onPress={() => router.push('/index')}
            activeOpacity={0.8}
          >
            <Text style={cartStyles.backButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => `${item.id}-${item.size || 'noid'}-${index}`}
          renderItem={({ item }) => (
            <CartItem 
              item={item} 
              increaseQuantity={increaseQuantity} 
              decreaseQuantity={decreaseQuantity} 
            />
          )}
          ListFooterComponent={renderFooter}
          ItemSeparatorComponent={() => <View style={cartStyles.separator} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const cartStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 16,
    color: '#111827',
  },
  // --- Cart Item Styling ---
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 2,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  sizeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  pricePerUnit: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  qtyCount: {
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 10,
    color: '#111827',
  },
  itemTotalPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: '#10b981', // Success green
    flex: 1,
    textAlign: 'right',
  },
  separator: {
    height: 10, // Increased space between items
    backgroundColor: 'transparent',
  },

  // --- Footer/Summary Styling ---
  footer: {
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
    marginTop: 15,
  },
  // --- Coupon Section Styling ---
  couponSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eef2ff',
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 15,
    marginRight: 10,
    backgroundColor: '#f9fafb',
  },
  couponButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    height: 45,
    justifyContent: 'center',
  },
  couponButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },

  // --- Summary Card Styling ---
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summaryText: {
    fontSize: 15,
    color: '#4b5563',
  },
  summaryAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  discountText: {
    color: '#ef4444',
  },
  discountAmount: {
    color: '#ef4444',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  totalAmount: {
    fontSize: 19,
    fontWeight: '900',
    color: '#2563eb',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#10b981', // Vibrant green for action
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
  // --- Empty State Styling ---
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 999,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});