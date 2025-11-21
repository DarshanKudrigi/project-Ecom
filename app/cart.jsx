import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useCart } from './_layout';

// Component for individual item in the cart
const CartItem = ({ item, increaseQuantity, decreaseQuantity, isSelected, onSelectItem }) => (
  <View style={cartStyles.cartItem}>
    <TouchableOpacity 
      style={cartStyles.checkbox}
      onPress={() => onSelectItem(item.id, item.size)}
      activeOpacity={0.7}
    >
      <FontAwesome 
        name={isSelected ? "check-square" : "square-o"} 
        size={20} 
        color={isSelected ? "#10b981" : "#d1d5db"} 
      />
    </TouchableOpacity>

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

// Component for bucket items with add/remove functionality
const BucketItem = ({ item, onAddItem, onRemoveItem, onSubtractItem }) => (
  <View style={cartStyles.bucketItem}>
    <View style={cartStyles.bucketItemLeft}>
      <View style={cartStyles.bucketItemIcon}>
        <FontAwesome name="check-circle" size={18} color="#10b981" />
      </View>
      <View style={cartStyles.bucketItemDetails}>
        <Text style={cartStyles.bucketName} numberOfLines={2}>
          {item.name}
          {item.size && <Text style={cartStyles.bucketSizeText}> - {item.size}</Text>}
        </Text>
        <Text style={cartStyles.bucketPrice}>
          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
        </Text>
      </View>
    </View>

    <View style={cartStyles.bucketControls}>
      <TouchableOpacity
        style={cartStyles.bucketButton}
        onPress={() => onSubtractItem(item.id, item.size)}
        activeOpacity={0.7}
      >
        <FontAwesome name="minus" size={12} color="#ef4444" />
      </TouchableOpacity>

      <Text style={cartStyles.bucketQty}>{item.quantity}</Text>

      <TouchableOpacity
        style={cartStyles.bucketButton}
        onPress={() => onAddItem(item.id, item.size)}
        activeOpacity={0.7}
      >
        <FontAwesome name="plus" size={12} color="#10b981" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[cartStyles.bucketButton, cartStyles.removeButton]}
        onPress={() => onRemoveItem(item.id, item.size)}
        activeOpacity={0.7}
      >
        <FontAwesome name="trash" size={12} color="#ef4444" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function CartScreen() {
  const { cartItems, increaseQuantity, decreaseQuantity } = useCart();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [bucketItems, setBucketItems] = useState([]);

  // Toggle item selection
  const toggleSelectItem = useCallback((itemId, size) => {
    const key = `${itemId}-${size || 'noid'}`;
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }, []);

  // Add selected items to bucket
  const addToBucket = useCallback(() => {
    const itemsToAdd = cartItems.filter(item => {
      const key = `${item.id}-${item.size || 'noid'}`;
      return selectedItems.has(key);
    });

    setBucketItems(prev => {
      const newBucketItems = [...prev];
      itemsToAdd.forEach(newItem => {
        const existingIndex = newBucketItems.findIndex(
          item => item.id === newItem.id && item.size === newItem.size
        );
        if (existingIndex > -1) {
          newBucketItems[existingIndex].quantity += newItem.quantity;
        } else {
          newBucketItems.push({ ...newItem });
        }
      });
      return newBucketItems;
    });

    setSelectedItems(new Set());
  }, [cartItems, selectedItems]);

  // Add item quantity in bucket
  const addBucketItemQuantity = useCallback((itemId, size) => {
    setBucketItems(prev =>
      prev.map(item =>
        item.id === itemId && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }, []);

  // Subtract item quantity in bucket
  const subtractBucketItemQuantity = useCallback((itemId, size) => {
    setBucketItems(prev =>
      prev.map(item =>
        item.id === itemId && item.size === size
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  }, []);

  // Remove item from bucket
  const removeBucketItem = useCallback((itemId, size) => {
    setBucketItems(prev =>
      prev.filter(item => !(item.id === itemId && item.size === size))
    );
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const bucketSubtotal = bucketItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const finalTotal = subtotal - discount;
  const bucketFinalTotal = bucketSubtotal - discount;
  const selectedCount = selectedItems.size;

  const handleApplyCoupon = () => {
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

      {cartItems.length > 0 && (
        <TouchableOpacity
          style={[
            cartStyles.addToBucketButton,
            selectedCount === 0 && cartStyles.disabledButton
          ]}
          onPress={addToBucket}
          activeOpacity={0.8}
          disabled={selectedCount === 0}
        >
          <FontAwesome name="shopping-basket" size={16} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={cartStyles.addToBucketText}>
            Add to Bucket ({selectedCount})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const handleProceedToDelivery = () => {
    if (bucketItems.length === 0) {
      alert('Please add items to the bucket before proceeding.');
      return;
    }

    const bucketData = {
      items: bucketItems,
      subtotal: bucketSubtotal,
      total: bucketFinalTotal,
      discount: discount,
    };

    router.push({
      pathname: '/delivery',
      params: { bucketData: JSON.stringify(bucketData) },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={cartStyles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {cartItems.length === 0 && bucketItems.length === 0 ? (
        <View style={cartStyles.emptyContainer}>
          <FontAwesome name="shopping-cart" size={60} color="#e5e7eb" style={{marginBottom: 10}}/>
          <Text style={cartStyles.emptyText}>
            Your cart is empty.
          </Text>
          <TouchableOpacity 
            style={cartStyles.backButton} 
            onPress={() => router.push('/')}
            activeOpacity={0.8}
          >
            <Text style={cartStyles.backButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* --- CART SECTION --- */}
          {cartItems.length > 0 && (
            <View>
              <Text style={cartStyles.title}>Your Shopping Cart</Text>
              <FlatList
                data={cartItems}
                keyExtractor={(item, index) => `${item.id}-${item.size || 'noid'}-${index}`}
                renderItem={({ item }) => (
                  <CartItem 
                    item={item} 
                    increaseQuantity={increaseQuantity} 
                    decreaseQuantity={decreaseQuantity}
                    isSelected={selectedItems.has(`${item.id}-${item.size || 'noid'}`)}
                    onSelectItem={toggleSelectItem}
                  />
                )}
                ItemSeparatorComponent={() => <View style={cartStyles.separator} />}
                scrollEnabled={false}
              />
              {renderFooter()}
            </View>
          )}

          {/* --- BUCKET SECTION --- */}
          {bucketItems.length > 0 && (
            <View style={cartStyles.bucketSection}>
              <Text style={cartStyles.bucketTitle}>Your Bucket 🛒</Text>
              
              <FlatList
                data={bucketItems}
                keyExtractor={(item, index) => `bucket-${item.id}-${item.size || 'noid'}-${index}`}
                renderItem={({ item }) => (
                  <BucketItem
                    item={item}
                    onAddItem={addBucketItemQuantity}
                    onRemoveItem={removeBucketItem}
                    onSubtractItem={subtractBucketItemQuantity}
                  />
                )}
                ItemSeparatorComponent={() => <View style={cartStyles.bucketSeparator} />}
                scrollEnabled={false}
              />

              {/* Coupon Section */}
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

              {/* Bucket Summary */}
              <View style={cartStyles.bucketSummaryCard}>
                <Text style={cartStyles.sectionHeader}>Bucket Summary</Text>

                <View style={cartStyles.summaryRow}>
                  <Text style={cartStyles.summaryText}>Subtotal</Text>
                  <Text style={cartStyles.summaryAmount}>₹{bucketSubtotal.toLocaleString('en-IN')}</Text>
                </View>

                <View style={cartStyles.summaryRow}>
                  <Text style={[cartStyles.summaryText, cartStyles.discountText]}>Coupon Discount</Text>
                  <Text style={[cartStyles.summaryAmount, cartStyles.discountAmount]}>- ₹{discount.toLocaleString('en-IN')}</Text>
                </View>

                <View style={cartStyles.totalRow}>
                  <Text style={cartStyles.totalText}>Total Amount</Text>
                  <Text style={cartStyles.bucketTotalAmount}>₹{bucketFinalTotal.toLocaleString('en-IN')}</Text>
                </View>
              </View>

              {/* Proceed to Payment Button */}
              <TouchableOpacity
                style={cartStyles.checkoutButton}
                onPress={handleProceedToDelivery}
                activeOpacity={0.8}
              >
                <FontAwesome name="shopping-bag" size={16} color="#ffffff" style={{ marginRight: 8 }} />
                <Text style={cartStyles.checkoutButtonText}>
                  Proceed to Buy (₹{bucketFinalTotal.toLocaleString('en-IN')})
                </Text>
              </TouchableOpacity>

              <View style={{ height: 30 }} />
            </View>
          )}
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const cartStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  // --- CART ITEM STYLES ---
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
  },
  checkbox: {
    marginRight: 12,
    padding: 4,
  },
  itemDetails: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  sizeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  pricePerUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2563eb',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  qtyButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  qtyCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotalPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    minWidth: 80,
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 0,
  },
  // --- FOOTER & COUPON STYLES ---
  footer: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  couponSection: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  couponInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
    marginRight: 8,
  },
  couponButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    justifyContent: 'center',
  },
  couponButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4b5563',
  },
  discountText: {
    color: '#10b981',
  },
  summaryAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  discountAmount: {
    color: '#10b981',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTopY: 12,
  },
  totalText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    paddingTop: 12,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
    paddingTop: 12,
  },
  addToBucketButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
  },
  addToBucketText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
  // --- BUCKET SECTION STYLES ---
  bucketSection: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#10b981',
    marginBottom: 16,
  },
  bucketTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#10b981',
  },
  bucketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  bucketItemLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bucketItemIcon: {
    marginRight: 10,
  },
  bucketItemDetails: {
    flex: 1,
  },
  bucketName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  bucketSizeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6b7280',
  },
  bucketPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
  },
  bucketControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bucketButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  bucketQty: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1f2937',
    minWidth: 18,
    textAlign: 'center',
  },
  removeButton: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  bucketSeparator: {
    height: 0,
    marginVertical: 0,
  },
  bucketSummaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  bucketTotalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
    paddingTop: 12,
  },
  checkoutButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
  },
  checkoutButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  // --- EMPTY STATE STYLES ---
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
