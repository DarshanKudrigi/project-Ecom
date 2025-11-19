import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// Assuming useCart is defined elsewhere and works
// import { useCart } from './_layout'; 
const useCart = () => ({ 
    addToCart: (item) => console.log('Adding to cart:', item.name),
    cartItems: [],
});

// --- PRODUCT DATA (KEPT UNCHANGED) ---
const PRODUCTS = [
  // Mobiles / Phones
  { id: 1, name: 'Wireless Phone X1', price: 15999, image: 'https://dummyjson.com/image/i/products/1/thumbnail.jpg', category: 'mobiles' }, // Mobile 1
  { id: 2, name: 'Smartphone Pro Max', price: 24999, image: 'https://dummyjson.com/image/i/products/2/thumbnail.jpg', category: 'mobiles' }, // Mobile 2
  { id: 3, name: 'Budget Phone A10', price: 8999, image: 'https://dummyjson.com/image/i/products/3/thumbnail.jpg', category: 'mobiles' }, // Mobile 3
  { id: 4, name: '5G Phone S Lite', price: 16999, image: 'https://dummyjson.com/image/i/products/4/thumbnail.jpg', category: 'mobiles' }, // Mobile 4
  { id: 5, name: 'Gaming Phone Beast', price: 29999, image: 'https://dummyjson.com/image/i/products/5/thumbnail.jpg', category: 'mobiles' }, // Mobile 5
  { id: 6, name: 'Mini Compact Phone', price: 6999, image: 'https://dummyjson.com/image/i/products/6/thumbnail.jpg', category: 'mobiles' }, // Mobile 6

  // Audio
  { id: 7, name: 'Wireless Headphones', price: 1999, image: 'https://dummyjson.com/image/i/products/21/thumbnail.jpg', category: 'audio' }, // Headphones
  { id: 8, name: 'Noise Cancelling Headset', price: 3499, image: 'https://dummyjson.com/image/i/products/22/thumbnail.jpg', category: 'audio' }, // Headset
  { id: 9, name: 'Bluetooth Earbuds', price: 1599, image: 'https://dummyjson.com/image/i/products/23/thumbnail.jpg', category: 'audio' }, // Earbuds
  { id: 10, name: 'True Wireless Earbuds', price: 2299, image: 'https://dummyjson.com/image/i/products/24/thumbnail.jpg', category: 'audio' }, // Wireless Earbuds
  { id: 11, name: 'Bluetooth Speaker Mini', price: 1299, image: 'https://dummyjson.com/image/i/products/25/thumbnail.jpg', category: 'audio' }, // Speaker 1
  { id: 12, name: 'Party Bluetooth Speaker', price: 2599, image: 'https://dummyjson.com/image/i/products/26/thumbnail.jpg', category: 'audio' }, // Speaker 2

  // Wearables
  { id: 13, name: 'Smart Watch Neo', price: 2499, image: 'https://dummyjson.com/image/i/products/31/thumbnail.jpg', category: 'wearables' }, // Watch 1
  { id: 14, name: 'Fitness Band Pro', price: 1499, image: 'https://dummyjson.com/image/i/products/32/thumbnail.jpg', category: 'wearables' }, // Band
  { id: 15, name: 'Smart Watch Active', price: 2799, image: 'https://dummyjson.com/image/i/products/33/thumbnail.jpg', category: 'wearables' }, // Watch 2
  { id: 16, name: 'Classic Smart Watch', price: 3199, image: 'https://dummyjson.com/image/i/products/34/thumbnail.jpg', category: 'wearables' }, // Watch 3

  // Electronics & Accessories
  { id: 17, name: 'Gaming Mouse', price: 999, image: 'https://dummyjson.com/image/i/products/17/thumbnail.jpg', category: 'electronics' }, // Mouse
  { id: 18, name: 'Mechanical Keyboard', price: 2499, image: 'https://dummyjson.com/image/i/products/18/thumbnail.jpg', category: 'electronics' }, // Keyboard
  { id: 19, name: 'USB-C Fast Charger', price: 799, image: 'https://dummyjson.com/image/i/products/19/thumbnail.jpg', category: 'electronics' }, // Charger
  { id: 20, name: 'Power Bank 10000mAh', price: 1399, image: 'https://dummyjson.com/image/i/products/20/thumbnail.jpg', category: 'electronics' }, // Power Bank
  { id: 21, name: 'Wireless Charging Pad', price: 1199, image: 'https://dummyjson.com/image/i/products/27/thumbnail.jpg', category: 'electronics' }, // Charger Pad
  { id: 22, name: 'Laptop Backpack', price: 1799, image: 'https://dummyjson.com/image/i/products/28/thumbnail.jpg', category: 'electronics' }, // Backpack
  { id: 23, name: 'Laptop Cooling Pad', price: 1299, image: 'https://dummyjson.com/image/i/products/29/thumbnail.jpg', category: 'electronics' }, // Cooling Pad
  { id: 24, name: 'HDMI Cable 2m', price: 399, image: 'https://dummyjson.com/image/i/products/30/thumbnail.jpg', category: 'electronics' }, // HDMI

  // Clothing (will ask for size)
  { id: 25, name: 'Men T-Shirt Basic', price: 699, image: 'https://dummyjson.com/image/i/products/41/thumbnail.jpg', category: 'clothing' }, // T-Shirt 1
  { id: 26, name: 'Men Casual Shirt', price: 1099, image: 'https://dummyjson.com/image/i/products/42/thumbnail.jpg', category: 'clothing' }, // Shirt
  { id: 27, name: 'Women Top Casual', price: 899, image: 'https://dummyjson.com/image/i/products/43/thumbnail.jpg', category: 'clothing' }, // Top
  { id: 28, name: 'Women Kurti Printed', price: 1199, image: 'https://dummyjson.com/image/i/products/44/thumbnail.jpg', category: 'clothing' }, // Kurti
  { id: 29, name: 'Unisex Hoodie', price: 1599, image: 'https://dummyjson.com/image/i/products/45/thumbnail.jpg', category: 'clothing' }, // Hoodie
  { id: 30, name: 'Track Pants', price: 999, image: 'https://dummyjson.com/image/i/products/46/thumbnail.jpg', category: 'clothing' }, // Pants 1
  { id: 31, name: 'Sports Shorts', price: 799, image: 'https://dummyjson.com/image/i/products/47/thumbnail.jpg', category: 'clothing' }, // Shorts
  { id: 32, name: 'Formal Trousers', price: 1499, image: 'https://dummyjson.com/image/i/products/48/thumbnail.jpg', category: 'clothing' }, // Trousers
  { id: 33, name: 'Women Jeans', price: 1699, image: 'https://dummyjson.com/image/i/products/49/thumbnail.jpg', category: 'clothing' }, // Jeans
  { id: 34, name: 'Men Denim Jacket', price: 2199, image: 'https://dummyjson.com/image/i/products/50/thumbnail.jpg', category: 'clothing' }, // Jacket

  // Groceries
  { id: 35, name: 'Basmati Rice 5kg', price: 599, image: 'https://dummyjson.com/image/i/products/51/thumbnail.jpg', category: 'groceries' }, // Rice
  { id: 36, name: 'Sunflower Oil 1L', price: 189, image: 'https://dummyjson.com/image/i/products/52/thumbnail.jpg', category: 'groceries' }, // Oil
  { id: 37, name: 'Atta 5kg', price: 329, image: 'https://dummyjson.com/image/i/products/53/thumbnail.jpg', category: 'groceries' }, // Atta
  { id: 38, name: 'Tea Powder 1kg', price: 399, image: 'https://dummyjson.com/image/i/products/54/thumbnail.jpg', category: 'groceries' }, // Tea
  { id: 39, name: 'Instant Coffee 200g', price: 249, image: 'https://dummyjson.com/image/i/products/55/thumbnail.jpg', category: 'groceries' }, // Coffee
  { id: 40, name: 'Biscuits Family Pack', price: 149, image: 'https://dummyjson.com/image/i/products/56/thumbnail.jpg', category: 'groceries' }, // Biscuits
  { id: 41, name: 'Breakfast Cereal', price: 299, image: 'https://dummyjson.com/image/i/products/57/thumbnail.jpg', category: 'groceries' }, // Cereal
  { id: 42, name: 'Organic Honey', price: 349, image: 'https://dummyjson.com/image/i/products/58/thumbnail.jpg', category: 'groceries' }, // Honey

  // Shoes / Sports
  { id: 43, name: 'Running Shoes', price: 2299, image: 'https://dummyjson.com/image/i/products/59/thumbnail.jpg', category: 'sports' }, // Shoes 1
  { id: 44, name: 'Sports Shoes Pro', price: 2599, image: 'https://dummyjson.com/image/i/products/60/thumbnail.jpg', category: 'sports' }, // Shoes 2
  { id: 45, name: 'Casual Sneakers', price: 1999, image: 'https://dummyjson.com/image/i/products/61/thumbnail.jpg', category: 'sports' }, // Shoes 3
  { id: 46, name: 'Gym Gloves', price: 499, image: 'https://dummyjson.com/image/i/products/62/thumbnail.jpg', category: 'sports' }, // Gloves

  // Extra accessories
  { id: 47, name: 'Mobile Back Cover', price: 299, image: 'https://dummyjson.com/image/i/products/63/thumbnail.jpg', category: 'electronics' }, // Cover
  { id: 48, name: 'Tempered Glass', price: 199, image: 'https://dummyjson.com/image/i/products/64/thumbnail.jpg', category: 'electronics' }, // Glass
  { id: 49, name: 'USB Flash Drive 32GB', price: 599, image: 'https://dummyjson.com/image/i/products/65/thumbnail.jpg', category: 'electronics' }, // Pendrive
  { id: 50, name: 'Wireless Keyboard Combo', price: 1999, image: 'https://dummyjson.com/image/i/products/66/thumbnail.jpg', category: 'electronics' }, // Keyboard Combo
  { id: 51, name: 'LED Desk Lamp', price: 899, image: 'https://dummyjson.com/image/i/products/67/thumbnail.jpg', category: 'electronics' }, // Lamp
  { id: 52, name: 'Portable Hard Drive 1TB', price: 4299, image: 'https://dummyjson.com/image/i/products/68/thumbnail.jpg', category: 'electronics' }, // HDD
];

const CATEGORIES = [
  { key: 'all', label: 'All', icon: 'th-large' },
  { key: 'mobiles', label: 'Mobiles', icon: 'mobile' },
  { key: 'audio', label: 'Audio', icon: 'headphones' },
  { key: 'wearables', label: 'Wearables', icon: 'clock-o' },
  { key: 'electronics', label: 'Electronics', icon: 'bolt' },
  { key: 'clothing', label: 'Clothing', icon: 'shopping-bag' },
  { key: 'groceries', label: 'Groceries', icon: 'shopping-basket' },
  { key: 'sports', label: 'Sports', icon: 'soccer-ball-o' },
];

export default function HomeScreen() {
  const { addToCart } = useCart();
  // const router = useRouter(); // Use this if you have expo-router setup
  const router = { push: (path) => console.log('Navigating to:', path) };

  const [activeCategory, setActiveCategory] = useState('all');
  const [cartCount, setCartCount] = useState(0); 
  const [showCartBar, setShowCartBar] = useState(false);

  const [sizeModalVisible, setSizeModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS;
    return PRODUCTS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  const finalizeAddToCart = (item, size) => {
    const productToAdd = size ? { ...item, size } : item;
    addToCart(productToAdd);
    setCartCount((prev) => prev + 1);
    setShowCartBar(true);
  };

  const handleAddToCart = (item) => {
    if (item.category === 'clothing') {
      setSelectedProduct(item);
      setSizeModalVisible(true);
    } else {
      finalizeAddToCart(item, null);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <Text style={styles.productName} numberOfLines={2}>
        {item.name}
      </Text>

      <View style={styles.cardBottom}>
        <Text style={styles.price}>₹{item.price.toLocaleString('en-IN')}</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
          activeOpacity={0.7}
        >
          <FontAwesome name="plus" size={14} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleGoToCart = () => {
    router.push('/cart');
  };

  // --- STICKY HEADER COMPONENT (FIXED) ---
  const ListHeader = () => (
    <View>
        {/* Wrapper View (Index 0): Contains the non-sticky elements (Top Bar, Greeting). 
            This is to ensure the Category chips are the first/second direct child 
            of the ListHeaderComponent's return value, making it stickable.
        */}
        <View> 
            {/* Top Bar - Simplified and styled for better appeal */}
            <View style={styles.topBar}>
                <Text style={styles.appName}>EasyBuy</Text>
                <Text style={styles.tagline}>Everything you need in one place</Text>
            </View>

            {/* Greeting Header */}
            <View style={styles.header}>
                <Text style={styles.hello}>Hello everyone 👋</Text>
                <Text style={styles.title}>Welcome to EasyBuy</Text>
                <Text style={styles.subtitle}>
                    Enjoy your shopping and find everything you need!
                </Text>
            </View>
        </View>


      {/* Category chips (Index 1) - This section will now be sticky */}
      <View style={[styles.categorySection, styles.stickyCategoryBackground]}>
        <Text style={styles.sectionTitle}>What's your mood?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat.key === activeCategory;
            return (
              <TouchableOpacity
                key={cat.key}
                onPress={() => setActiveCategory(cat.key)}
                style={[
                  styles.categoryChip,
                  isActive && styles.categoryChipActive,
                ]}
                activeOpacity={0.8}
              >
                <FontAwesome
                  name={cat.icon}
                  size={14}
                  color={isActive ? '#fff' : '#4b5563'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isActive && styles.categoryTextActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      {/* Separator style added for visual break */}
      <View style={styles.sectionSeparator} /> 
    </View>
  );
  // ------------------------------

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Products list with Sticky Header */}
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={3}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          // The index of the sticky component is now 1: the categorySection View
          stickyHeaderIndices={[1]}
        />

        {/* Bottom persistent cart bar */}
        {showCartBar && (
          <View style={styles.cartBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.cartBarIcon}>
                <FontAwesome name="shopping-cart" size={18} color="#2563eb" />
              </View>
              <View>
                <Text style={styles.cartBarTitle}>Cart updated</Text>
                <Text style={styles.cartBarSubtitle}>
                  {cartCount} item{cartCount > 1 ? 's' : ''} in your cart
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.cartBarButton}
              onPress={handleGoToCart}
              activeOpacity={0.8}
            >
              <Text style={styles.cartBarButtonText}>Go to Cart</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Size selection modal for clothing */}
        <Modal
          visible={sizeModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setSizeModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select size</Text>
              {selectedProduct && (
                <Text style={styles.modalSubtitle}>
                  {selectedProduct.name}
                </Text>
              )}

              <View style={styles.sizeRow}>
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <Pressable
                    key={size}
                    style={styles.sizeButton}
                    onPress={() => {
                      if (selectedProduct) {
                        finalizeAddToCart(selectedProduct, size);
                      }
                      setSizeModalVisible(false);
                      setSelectedProduct(null);
                    }}
                  >
                    <Text style={styles.sizeButtonText}>{size}</Text>
                  </Pressable>
                ))}
              </View>

              <Pressable
                style={styles.modalCancel}
                onPress={() => {
                  setSizeModalVisible(false);
                  setSelectedProduct(null);
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f3f4f6', // Lighter background for better contrast
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    // Removed paddingTop since Safe View handles it, and Top Bar needs to be fluid
  },
  // --- UPDATED TOP BAR (UI/UX) ---
  topBar: {
    flexDirection: 'column', // Changed to column for better title flow
    alignItems: 'flex-start',
    backgroundColor: '#ffffff', // White top bar
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16, // Space before greeting
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb', // Accent line
  },
  appName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1f2937',
  },
  tagline: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },

  // --- HEADER (GREETING) ---
  header: {
    marginBottom: 12,
    paddingVertical: 4,
  },
  hello: {
    fontSize: 14, 
    fontWeight: '500',
    color: '#4b5563',
  },
  title: {
    fontSize: 28, // Larger title
    fontWeight: '800', 
    color: '#111827',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },

  // --- STICKY CATEGORY SECTION (FIXED/IMPROVED) ---
  categorySection: {
    paddingTop: 10,
    paddingBottom: 6,
    // Remove marginHorizontal to contain to container padding
    marginHorizontal: -16, 
    paddingHorizontal: 16,
    // This padding ensures content doesn't get cut off on the right
    paddingRight: 0, 
  },
  stickyCategoryBackground: {
    backgroundColor: '#f3f4f6', // Match safe/container background
    zIndex: 10, 
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // Softer border color
    paddingBottom: 10, // More breathing room when sticky
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700', 
    color: '#111827',
    marginBottom: 10,
  },
  sectionSeparator: {
    // This adds a small space after the sticky header when not sticky
    height: 10,
    backgroundColor: '#f3f4f6', // Match background
    marginHorizontal: -16,
  },
  categoryScroll: {
    paddingRight: 20, // To see the end of the last chip
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14, // Increased padding
    paddingVertical: 8,
    borderRadius: 20, // Slightly more pronounced rounded corners
    backgroundColor: '#ffffff', // White chips
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  categoryText: {
    fontSize: 13,
    color: '#4b5563',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },

  // --- PRODUCT LIST & CARD ---
  listContent: {
    paddingBottom: 120, // Space for cart bar
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12, // Softer corners
    padding: 8,
    width: '31%',
    // Cleaner, more subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4, 
    minHeight: 180, // Ensure minimum height consistency
    justifyContent: 'space-between', // Push add button to bottom
  },
  image: {
    width: '100%',
    height: 80, // Slightly smaller image for better card density
    borderRadius: 8,
    marginBottom: 6,
    resizeMode: 'contain', // Changed to contain for product images
  },
  productName: {
    fontSize: 12, 
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
    minHeight: 30, // Reserve space for 2 lines
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontSize: 14, 
    fontWeight: '800',
    color: '#1f2937', // Darker price for contrast
  },
  addButton: {
    width: 32, // Larger touch target
    height: 32,
    borderRadius: 999,
    backgroundColor: '#ef4444', // Red accent for action
    alignItems: 'center',
    justifyContent: 'center',
    // Subtle shadow for the action button
    shadowColor: '#ef4444',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  // --- CART BAR & MODAL (Slightly improved colors/spacing) ---
  cartBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: '#1f2937', // Darker background
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  cartBarIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cartBarTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  cartBarSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  cartBarButton: {
    backgroundColor: '#2563eb',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cartBarButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40, // Increased bottom padding
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sizeButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  sizeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4f46e5',
  },
  modalCancel: {
    alignSelf: 'center',
    marginTop: 10,
    padding: 5,
  },
  modalCancelText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '600',
  },
});