// app/(tabs)/delivery.jsx

import React, { useState, useEffect } from 'react';
import {    
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useCart } from './_layout';

// Color Palette
const colors = {
  primary: '#2563eb',
  secondary: '#10b981',
  danger: '#ef4444',
  background: '#f3f4f6',
  card: '#ffffff',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  inputBorder: '#d1d5db',
  success: '#10b981',
};

export default function DeliveryScreen() {
  const router = useRouter();
  const { bucketData: bucketDataParam } = useLocalSearchParams(); // ✅ only take what we need
  const { cartItems } = useCart();

  // Parse bucket data from params
  const [bucketItems, setBucketItems] = useState([]);
  const [bucketData, setBucketData] = useState({
    subtotal: 0,
    total: 0,
    discount: 0,
  });

  useEffect(() => {
    // ✅ Use the actual param value, not the whole params object
    if (bucketDataParam) {
      try {
        const data = JSON.parse(bucketDataParam);
        setBucketItems(data.items || []);
        setBucketData({
          subtotal: data.subtotal || 0,
          total: data.total || 0,
          discount: data.discount || 0,
        });
      } catch (error) {
        // Fallback to cart items if parsing fails
        setBucketItems(cartItems);
      }
    } else {
      // Fallback to cart items if no bucket data
      setBucketItems(cartItems);
    }
  }, [bucketDataParam, cartItems]); // ✅ no [params] here

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pinCode: '',
    state: '',
  });

  const [errors, setErrors] = useState({});

  // Calculate totals based on bucket data
  const subtotal = bucketData.subtotal > 0 
    ? bucketData.subtotal 
    : bucketItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const shipping = subtotal > 500 ? 0 : 50;
  
  const total = bucketData.total > 0 
    ? bucketData.total 
    : (subtotal + shipping);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.pinCode.trim()) {
      newErrors.pinCode = 'PIN Code is required';
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = 'PIN Code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleProceedToPayment = () => {
    if (validateForm()) {
      const orderData = {
        deliveryDetails: formData,
        bucketItems: bucketItems,
        subtotal: subtotal,
        shipping: shipping,
        total: total,
      };

      // Navigate to payment tab with order data
      router.push({
        pathname: '/payment',
        params: { orderData: JSON.stringify(orderData) },
      });
    } else {
      Alert.alert('Validation Error', 'Please fill all fields correctly');
    }
  };

  const getFieldIcon = (field) => {
    const icons = {
      fullName: 'user',
      phone: 'phone',
      email: 'envelope',
      address: 'map-marker',
      city: 'map-pin',
      state: 'globe',
      pinCode: 'barcode',
    };
    return icons[field] || 'info-circle';
  };

  const handleInputField = (label, field, placeholder, keyboardType = 'default', maxLength = null) => (
    <View key={field} style={deliveryStyles.fieldContainer}>
      <Text style={deliveryStyles.label}>
        <FontAwesome name={getFieldIcon(field)} size={14} color={colors.secondary} style={{ marginRight: 6 }} />
        {label}
        <Text style={deliveryStyles.required}>*</Text>
      </Text>
      <TextInput
        style={[
          deliveryStyles.input,
          errors[field] && deliveryStyles.inputError,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
      {errors[field] && (
        <Text style={deliveryStyles.errorText}>
          <FontAwesome name="exclamation-circle" size={12} color={colors.danger} /> {errors[field]}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={deliveryStyles.safeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={deliveryStyles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={deliveryStyles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <FontAwesome name="arrow-left" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={deliveryStyles.headerTitle}>Delivery Details</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Order Summary Card */}
          <View style={deliveryStyles.summaryCard}>
            <View style={deliveryStyles.summaryRow}>
              <View style={deliveryStyles.summaryIcon}>
                <FontAwesome name="box" size={20} color={colors.secondary} />
              </View>
              <View style={deliveryStyles.summaryContent}>
                <Text style={deliveryStyles.summaryLabel}>Items in Bucket</Text>
                <Text style={deliveryStyles.summaryValue}>
                  {bucketItems.reduce((sum, item) => sum + item.quantity, 0)} items
                </Text>
              </View>
              <View style={deliveryStyles.summaryAmount}>
                <Text style={deliveryStyles.summaryPrice}>₹{subtotal.toLocaleString('en-IN')}</Text>
              </View>
            </View>

            <View style={deliveryStyles.divider} />

            <View style={deliveryStyles.summaryRow}>
              <View style={deliveryStyles.summaryIcon}>
                <FontAwesome name="truck" size={20} color={colors.primary} />
              </View>
              <View style={deliveryStyles.summaryContent}>
                <Text style={deliveryStyles.summaryLabel}>Shipping Charges</Text>
                <Text style={deliveryStyles.summaryValue}>
                  {shipping === 0 ? '₹49' : `₹${shipping}`}
                </Text>
              </View>
              <View style={deliveryStyles.summaryAmount}>
                <Text style={[deliveryStyles.summaryPrice, shipping === 0 && deliveryStyles.freeShipping]}>
                  {shipping === 0 ? '✓ ' : `₹${shipping}`}
                </Text>
              </View>
            </View>

            <View style={deliveryStyles.divider} />

            <View style={deliveryStyles.summaryRow}>
              <View style={deliveryStyles.summaryIcon}>
                <FontAwesome name="credit-card" size={20} color={colors.danger} />
              </View>
              <View style={deliveryStyles.summaryContent}>
                <Text style={deliveryStyles.summaryLabel}>Total Bucket-Amount</Text>
                <Text style={deliveryStyles.summaryTotal}>₹{total.toLocaleString('en-IN')}</Text>
              </View>
            </View>
          </View>

          {/* Form Section */}
          <View style={deliveryStyles.formSection}>
            <Text style={deliveryStyles.formTitle}>
              <FontAwesome name="info-circle" size={16} color={colors.secondary} /> Enter Your Details
            </Text>

            {/* Row 1: Name and Phone */}
            <View style={deliveryStyles.row}>
              <View style={deliveryStyles.halfField}>
                {handleInputField('Full Name', 'fullName', 'John Doe')}
              </View>
              <View style={deliveryStyles.halfField}>
                {handleInputField('Phone Number', 'phone', '9876543210', 'phone-pad', 10)}
              </View>
            </View>

            {/* Email */}
            {handleInputField('Email Address', 'email', 'john@example.com', 'email-address')}

            {/* Address */}
            {handleInputField('Address', 'address', 'Apartment/House, Street')}

            {/* City & State */}
            <View style={deliveryStyles.row}>
              <View style={deliveryStyles.halfField}>
                {handleInputField('City', 'city', 'Mumbai')}
              </View>
              <View style={deliveryStyles.halfField}>
                {handleInputField('State', 'state', 'Maharashtra')}
              </View>
            </View>

            {/* PIN */}
            {handleInputField('PIN Code', 'pinCode', '400001', 'number-pad', 6)}

            {/* Info Message */}
            <View style={deliveryStyles.infoBox}>
              <FontAwesome name="shield" size={16} color={colors.secondary} />
              <Text style={deliveryStyles.infoText}>
                Your details are secure and will only be used for delivery
              </Text>
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Proceed to Payment Button - Fixed at Bottom */}
        <View style={deliveryStyles.buttonContainer}>
          <TouchableOpacity
            style={deliveryStyles.proceedButton}
            onPress={handleProceedToPayment}
            activeOpacity={0.8}
          >
            <FontAwesome name="check-circle" size={18} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={deliveryStyles.proceedButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const deliveryStyles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  summaryAmount: {
    alignItems: 'flex-end',
  },
  summaryPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  freeShipping: {
    color: colors.secondary,
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.secondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  formSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  required: {
    color: colors.danger,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: '#f9fafb',
    fontWeight: '500',
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: '#fef2f2',
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -8,
  },
  halfField: {
    flex: 1,
    marginHorizontal: 8,
  },
  infoBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
  },
  infoText: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: '500',
    marginLeft: 10,
    flex: 1,
  },
  buttonContainer: {
    paddingBottom: 16,
    paddingTop: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  proceedButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: colors.secondary,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
});
