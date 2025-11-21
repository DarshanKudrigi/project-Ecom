// app/(tabs)/payment.jsx

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5, FontAwesome } from '@expo/vector-icons';

export default function Payment() {
  const router = useRouter();
  const { orderData: orderDataParam } = useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [orderData, setOrderData] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Payment form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    if (orderDataParam) {
      try {
        const data = JSON.parse(orderDataParam);
        setOrderData(data);
      } catch (error) {
        // Handle error silently
      }
    }
  }, [orderDataParam]);

  // Fallback values if no order data
  const deliveryDetails = orderData?.deliveryDetails || {};
  const bucketItems = orderData?.bucketItems || [];
  const subtotal = orderData?.subtotal || 2499;
  const shipping = orderData?.shipping || 49;
  const totalToPay = subtotal + shipping; // Calculate total as items + delivery

  // Validation function
  const isPaymentDetailsValid = () => {
    if (selectedMethod === 'card') {
      const isCardNumberValid = cardNumber.trim().length === 16 && /^\d+$/.test(cardNumber);
      const isNameValid = cardName.trim().length > 0;
      const isExpiryValid = cardExpiry.trim().length === 5 && /^\d{2}\/\d{2}$/.test(cardExpiry);
      const isCVVValid = cardCVV.trim().length === 3 && /^\d+$/.test(cardCVV);
      return isCardNumberValid && isNameValid && isExpiryValid && isCVVValid;
    } else if (selectedMethod === 'upi') {
      return upiId.trim().length > 0 && upiId.includes('@');
    }
    return true; // COD doesn't need validation
  };

  const handlePaymentSuccess = () => {
    if (!isPaymentDetailsValid()) {
      let errorMsg = 'Please fill all required payment details correctly.';
      if (selectedMethod === 'card') {
        errorMsg = 'Please enter valid card details:\n- Card number (16 digits)\n- Name on card\n- Expiry (MM/YY)\n- CVV (3 digits)';
      } else if (selectedMethod === 'upi') {
        errorMsg = 'Please enter a valid UPI ID (e.g., yourname@upi)';
      }
      Alert.alert('Invalid Details', errorMsg);
      return;
    }

    setOrderPlaced(true);
  };

  const handleGoHome = () => {
    setOrderPlaced(false);
    router.push('/');
  };

  // Confirmation Screen
  if (orderPlaced) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.confirmationContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.confirmationContainer}>
            {/* Success Icon */}
            <View style={styles.successIconContainer}>
              <View style={styles.successCircle}>
                <FontAwesome name="check" size={60} color="#ffffff" />
              </View>
            </View>

            {/* Success Title */}
            <Text style={styles.successTitle}>Order Placed Successfully!</Text>
            
            {/* Order Details Box */}
            <View style={styles.orderDetailsBox}>
              <Text style={styles.orderDetailsLabel}>Order Total</Text>
              <Text style={styles.orderDetailsAmount}>₹{totalToPay.toLocaleString('en-IN')}</Text>
              <View style={styles.dividerLine} />
              <Text style={styles.paymentMethod}>
                <FontAwesome name="shield" size={14} color="#10b981" /> Payment Method: {selectedMethod.toUpperCase()}
              </Text>
            </View>

            {/* Thank You Message */}
            <Text style={styles.thankYouMessage}>Thank you for shopping with us!</Text>

            {/* Confirmation Info */}
            <View style={styles.confirmationInfo}>
              <FontAwesome name="info-circle" size={16} color="#2563eb" />
              <Text style={styles.confirmationInfoText}>
                A confirmation email has been sent to {deliveryDetails.email || 'your email'}
              </Text>
            </View>

            {/* Go Home Button */}
            <TouchableOpacity
              style={styles.homeButton}
              onPress={handleGoHome}
              activeOpacity={0.7}
            >
              <FontAwesome name="home" size={20} color="#ffffff" style={{ marginRight: 8 }} />
              <Text style={styles.homeButtonText}>Go Back to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="shield-checkmark" size={22} />
          <Text style={styles.headerTitle}>Secure Payment</Text>
        </View>
        <Text style={styles.headerSub}>100% Payment Protection</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#2563eb" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        {/* Delivery Details Card */}
        {orderData && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.detailsBox}>
              <Text style={styles.detailsText}>
                <Text style={styles.detailsLabel}>Name: </Text>
                {deliveryDetails.fullName || 'Not provided'}
              </Text>
              <Text style={styles.detailsText}>
                <Text style={styles.detailsLabel}>Phone: </Text>
                {deliveryDetails.phone || 'Not provided'}
              </Text>
              <Text style={styles.detailsText}>
                <Text style={styles.detailsLabel}>Email: </Text>
                {deliveryDetails.email || 'Not provided'}
              </Text>
              <Text style={styles.detailsText}>
                <Text style={styles.detailsLabel}>Address: </Text>
                {deliveryDetails.address || 'Not provided'}
              </Text>
              <Text style={styles.detailsText}>
                <Text style={styles.detailsLabel}>City: </Text>
                {deliveryDetails.city || 'Not provided'}
              </Text>
              <Text style={styles.detailsText}>
                <Text style={styles.detailsLabel}>State: </Text>
                {deliveryDetails.state || 'Not provided'}
              </Text>
              <Text style={styles.detailsText}>
                <Text style={styles.detailsLabel}>PIN: </Text>
                {deliveryDetails.pinCode || 'Not provided'}
              </Text>
            </View>
          </View>
        )}

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          {bucketItems.length > 0 && (
            <>
              <Text style={styles.itemsLabel}>Items ({bucketItems.length})</Text>
              {bucketItems.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name} x {item.quantity}
                  </Text>
                  <Text style={styles.itemPrice}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </Text>
                </View>
              ))}
              <View style={styles.separator} />
            </>
          )}

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Items total</Text>
            <Text style={styles.value}>₹ {subtotal.toLocaleString('en-IN')}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Delivery</Text>
            <Text style={styles.value}>
              {shipping === 0 ? 'FREE' : `₹ ${shipping}`}
            </Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.rowBetween}>
            <Text style={styles.totalLabel}>Total to pay</Text>
            <Text style={styles.totalValue}>₹ {totalToPay.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Options</Text>

          {/* Card */}
          <TouchableOpacity
            style={[
              styles.methodButton,
              selectedMethod === 'card' && styles.methodButtonActive,
            ]}
            onPress={() => setSelectedMethod('card')}
          >
            <View style={styles.methodLeft}>
              <MaterialIcons name="credit-card" size={22} />
              <View>
                <Text style={styles.methodTitle}>Credit / Debit Card</Text>
                <Text style={styles.methodSubtitle}>Visa, MasterCard, RuPay</Text>
              </View>
            </View>
            {selectedMethod === 'card' && (
              <Ionicons name="checkmark-circle" size={20} />
            )}
          </TouchableOpacity>

          {/* UPI */}
          <TouchableOpacity
            style={[
              styles.methodButton,
              selectedMethod === 'upi' && styles.methodButtonActive,
            ]}
            onPress={() => setSelectedMethod('upi')}
          >
            <View style={styles.methodLeft}>
              <FontAwesome5 name="sms" size={18} style={{ marginRight: 10 }} />
              <View>
                <Text style={styles.methodTitle}>UPI</Text>
                <Text style={styles.methodSubtitle}>GPay, PhonePe, Paytm, BHIM</Text>
              </View>
            </View>
            {selectedMethod === 'upi' && (
              <Ionicons name="checkmark-circle" size={20} />
            )}
          </TouchableOpacity>

          {/* Cash on Delivery */}
          <TouchableOpacity
            style={[
              styles.methodButton,
              selectedMethod === 'cod' && styles.methodButtonActive,
            ]}
            onPress={() => setSelectedMethod('cod')}
          >
            <View style={styles.methodLeft}>
              <Ionicons name="cash" size={22} />
              <View>
                <Text style={styles.methodTitle}>Cash on Delivery</Text>
                <Text style={styles.methodSubtitle}>Pay with cash at your door</Text>
              </View>
            </View>
            {selectedMethod === 'cod' && (
              <Ionicons name="checkmark-circle" size={20} />
            )}
          </TouchableOpacity>
        </View>

        {/* Method Details - Card */}
        {selectedMethod === 'card' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Card Details</Text>

            <Text style={styles.inputLabel}>Card Number *</Text>
            <View style={styles.inputWithIcon}>
              <Ionicons name="card" size={18} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#888"
                maxLength={16}
                value={cardNumber}
                onChangeText={setCardNumber}
              />
            </View>

            <Text style={styles.inputLabel}>Name on Card *</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#888"
              value={cardName}
              onChangeText={setCardName}
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.inputLabel}>Expiry (MM/YY) *</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  placeholder="08/28"
                  placeholderTextColor="#888"
                  maxLength={5}
                  value={cardExpiry}
                  onChangeText={setCardExpiry}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.inputLabel}>CVV *</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  secureTextEntry
                  placeholder="***"
                  placeholderTextColor="#888"
                  maxLength={3}
                  value={cardCVV}
                  onChangeText={setCardCVV}
                />
              </View>
            </View>

            <View style={styles.secureRow}>
              <Ionicons name="lock-closed" size={16} />
              <Text style={styles.secureText}>
                Your card details are encrypted and safe.
              </Text>
            </View>
          </View>
        )}

        {/* Method Details - UPI */}
        {selectedMethod === 'upi' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>UPI Payment</Text>
            <Text style={styles.helperText}>
              Enter your UPI ID to receive a payment request.
            </Text>
            <Text style={styles.inputLabel}>UPI ID *</Text>
            <TextInput
              style={styles.input}
              placeholder="username@okicici"
              placeholderTextColor="#888"
              autoCapitalize="none"
              value={upiId}
              onChangeText={setUpiId}
            />
            <View style={styles.secureRow}>
              <MaterialIcons name="verified-user" size={16} />
              <Text style={styles.secureText}>We never store your UPI PIN.</Text>
            </View>
          </View>
        )}

        {/* Method Details - COD */}
        {selectedMethod === 'cod' && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Cash on Delivery</Text>
            <Text style={styles.helperText}>
              Please keep the exact cash ready. Card / UPI may not be available at
              the doorstep.
            </Text>
            <View style={[styles.secureRow, { marginTop: 8 }]}>
              <Ionicons name="information-circle-outline" size={16} />
              <Text style={styles.secureText}>
                COD might not be available for all locations.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom fixed bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Total</Text>
          <Text style={styles.bottomValue}>₹ {totalToPay.toLocaleString('en-IN')}</Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.payButton,
            !isPaymentDetailsValid() && styles.payButtonDisabled,
          ]}
          onPress={handlePaymentSuccess}
          activeOpacity={0.7}
          disabled={!isPaymentDetailsValid()}
        >
          <Ionicons name="lock-closed" size={18} style={{ marginRight: 6 }} />
          <Text style={styles.payButtonText}>
            {selectedMethod === 'cod' ? 'Place Order' : 'Pay Securely'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.3,
    borderColor: '#ddd',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSub: {
    fontSize: 12,
    color: '#666',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  backButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    elevation: 2,
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  detailsBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  detailsText: {
    fontSize: 13,
    color: '#374151',
    marginVertical: 4,
    lineHeight: 18,
  },
  detailsLabel: {
    fontWeight: '700',
    color: '#1f2937',
  },
  itemsLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    marginTop: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    marginBottom: 6,
  },
  itemName: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10b981',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  label: {
    fontSize: 13,
    color: '#777',
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  methodButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    marginTop: 8,
  },
  methodButtonActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  methodSubtitle: {
    fontSize: 11,
    color: '#777',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 4,
    color: '#1f2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#fafafa',
    color: '#1f2937',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 8,
    backgroundColor: '#fafafa',
  },
  inputIcon: {
    marginRight: 4,
    color: '#2563eb',
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  secureText: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderTopWidth: 0.4,
    borderColor: '#ddd',
  },
  bottomLabel: {
    fontSize: 12,
    color: '#777',
  },
  bottomValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#10b981',
    elevation: 5,
    shadowColor: '#10b981',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  payButtonDisabled: {
    backgroundColor: '#d1d5db',
    elevation: 0,
    shadowOpacity: 0,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  // Confirmation Screen Styles
  confirmationContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  confirmationContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  successIconContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#10b981',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  orderDetailsBox: {
    width: '100%',
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  orderDetailsLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  orderDetailsAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 12,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#d1e7dd',
    marginBottom: 12,
  },
  paymentMethod: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  thankYouMessage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: '#2563eb',
  },
  confirmationInfoText: {
    fontSize: 12,
    color: '#1e40af',
    marginLeft: 8,
    flex: 1,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#2563eb',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    width: '100%',
    marginTop: 8,
  },
  homeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
