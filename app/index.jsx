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
  TextInput,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from './_layout';

// --- PRODUCT DATA (same as yours) ---
const PRODUCTS = [
  // Mobiles / Phones
  { id: 1, name: 'Samsung Galaxy A35', price: 25999, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/D/1.jpg', category: 'mobiles' },
  { id: 2, name: 'Iphone 16 Pro Max', price: 69999, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/D/2.jpg?updatedAt=1763652727668', category: 'mobiles' },
  { id: 3, name: ' RealMe 13 5G Pro', price: 18999, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/D/3.jpg?updatedAt=1763652727504', category: 'mobiles' },
  { id: 4, name: 'Redmi 15 5G', price: 16999, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/D/4.jpg?updatedAt=1763652728376', category: 'mobiles' },
  { id: 5, name: 'ROG Gaming Beast 5G', price: 29999, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/D/5.jpg?updatedAt=1763652728285', category: 'mobiles' },
  { id: 6, name: 'Samsung Z Fold 5G', price: 73999, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/D/6.jpg?updatedAt=1763652727816', category: 'mobiles' },

  // Audio
  { id: 7, name: 'Wireless Headphones', price: 1999, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/D/7.jpg?updatedAt=1763652727216', category: 'audio' },
  { id: 8, name: 'Noise Cancelling Headset', price: 3499, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/D/8.jpg?updatedAt=1763652728412', category: 'audio' },
  { id: 9, name: 'Bluetooth Earbuds', price: 1599, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/D/9.jpg?updatedAt=1763652727618', category: 'audio' },
  { id: 10, name: 'True Wireless Earbuds', price: 2299, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/D/10.jpg?updatedAt=1763652727951', category: 'audio' },
  { id: 11, name: 'Bluetooth Speaker Mini', price: 1299, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/D/11.jpg?updatedAt=1763652728298', category: 'audio' },
  { id: 12, name: 'Party Bluetooth Speaker', price: 2599, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/D/12.jpg?updatedAt=1763652728158', category: 'audio' },

  // Wearables
  { id: 13, name: 'Smart Watch Neo', price: 2499, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/A1.jpg?updatedAt=1763652750083', category: 'wearables' },
  { id: 14, name: 'Fitness Band Pro', price: 1499, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/2.jpg?updatedAt=1763652748060', category: 'wearables' },
  { id: 15, name: 'Smart Watch Active', price: 2799, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/3.jpg?updatedAt=1763652745454', category: 'wearables' },
  { id: 16, name: 'Classic Smart Watch', price: 3199, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/4.jpg?updatedAt=1763652748462', category: 'wearables' },

  // Electronics & Accessories
  { id: 17, name: 'Gaming Mouse', price: 999, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/5.jpg?updatedAt=1763652747882', category: 'electronics' },
  { id: 18, name: 'Mechanical Keyboard', price: 2499, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/6.jpg?updatedAt=1763652749955', category: 'electronics' },
  { id: 19, name: 'USB-C Fast Charger', price: 799, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/7.jpg?updatedAt=1763652745830', category: 'electronics' },
  { id: 20, name: 'Power Bank 10000mAh', price: 1399, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/8.jpg?updatedAt=1763652749588', category: 'electronics' },
  { id: 21, name: 'Wireless Charging Pad', price: 1199, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/9.jpg?updatedAt=1763652749659', category: 'electronics' },
  { id: 22, name: 'Laptop Backpack', price: 1799, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/10.jpg?updatedAt=1763652744892', category: 'electronics' },
  { id: 23, name: 'Laptop Cooling Pad', price: 1299, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/11.jpg?updatedAt=1763652744772', category: 'electronics' },
  { id: 24, name: 'HDMI Cable 2m', price: 399, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/12.jpg?updatedAt=1763652745024', category: 'electronics' },

  // Clothing
  { id: 25, name: 'Men T-Shirt Basic', price: 699, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/13.jpg?updatedAt=1763652745755', category: 'clothing' },
  { id: 26, name: 'Men Casual Shirt', price: 1099, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/14.jpg?updatedAt=1763652746201', category: 'clothing' },
  { id: 27, name: 'Women Top Casual', price: 899, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/15.jpg?updatedAt=1763652745671', category: 'clothing' },
  { id: 28, name: 'Women Kurti Printed', price: 1199, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/16.jpg?updatedAt=1763652747262', category: 'clothing' },
  { id: 29, name: 'Unisex Hoodie', price: 1599, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/17.jpg?updatedAt=1763652746030', category: 'clothing' },
  { id: 30, name: 'Track Pants', price: 999, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/18.jpg?updatedAt=1763652747465', category: 'clothing' },
  { id: 31, name: 'Sports Shorts', price: 799, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/19.jpg?updatedAt=1763652745026', category: 'clothing' },
  { id: 32, name: 'Formal Trousers', price: 1499, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/20.jpg?updatedAt=1763652747514', category: 'clothing' },
  { id: 33, name: 'Women Jeans', price: 1699, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/21.jpg?updatedAt=1763652748330', category: 'clothing' },
  { id: 34, name: 'Men Denim Jacket', price: 2199, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/22.jpg?updatedAt=1763652748620', category: 'clothing' },

  // Groceries
  { id: 35, name: 'Basmati Rice 5kg', price: 599, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/23.jpg?updatedAt=1763652749191', category: 'groceries' },
  { id: 36, name: 'Sunflower Oil 1L', price: 189, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/24.jpg?updatedAt=1763652748907', category: 'groceries' },
  { id: 37, name: 'Atta 5kg', price: 329, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/25.jpg?updatedAt=1763652749283', category: 'groceries' },
  { id: 38, name: 'Tea Powder 1kg', price: 399, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/26.jpg?updatedAt=1763652749332', category: 'groceries' },
  { id: 39, name: 'Instant Coffee 200g', price: 249, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/27.jpg?updatedAt=1763652749530', category: 'groceries' },
  { id: 40, name: 'Biscuits Family Pack', price: 149, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/28.jpg?updatedAt=1763652747212', category: 'groceries' },
  { id: 41, name: 'Breakfast Cereal', price: 299, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/29.jpg?updatedAt=1763652749820', category: 'groceries' },
  { id: 42, name: 'Organic Honey', price: 349, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/N/30.jpg?updatedAt=1763652745254', category: 'groceries' },

  // Shoes / Sports
  { id: 43, name: 'Running Shoes', price: 2299, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/1.jpg', category: 'sports' },
  { id: 44, name: 'Sports Shoes Pro', price: 2599, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/2.jpg', category: 'sports' },
  { id: 45, name: 'Casual Sneakers', price: 1999, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/3.jpg', category: 'sports' },
  { id: 46, name: 'Gym Gloves', price: 499, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/4.jpg', category: 'sports' },

  // Extra accessories
  { id: 47, name: 'Mobile Back Cover', price: 299, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/5.jpg', category: 'electronics' },
  { id: 48, name: 'Tempered Glass', price: 199, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/6.jpg', category: 'electronics' },
  { id: 49, name: 'USB Flash Drive 32GB', price: 599, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/7.jpg', category: 'electronics' },
  { id: 50, name: 'Wireless Keyboard Combo', price: 1999, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/8.jpg', category: 'electronics' },
  { id: 51, name: 'LED Desk Lamp', price: 899, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/9.png', category: 'electronics' },
  { id: 52, name: 'Portable Hard Drive 1TB', price: 4299, image: 'https://ik.imagekit.io/yg9mbw85q/SPORTS/10.jpg', category: 'electronics' },

];

// --- CATEGORIES DEFINITION (The Fix) ---
const CATEGORIES = [
  { key: 'all', label: 'All Products', icon: 'th-large' },
  { key: 'mobiles', label: 'Mobiles', icon: 'mobile' },
  { key: 'audio', label: 'Audio', icon: 'headphones' },
  { key: 'wearables', label: 'Wearables', icon: 'watch' },
  { key: 'electronics', label: 'Electronics', icon: 'desktop' },
  { key: 'clothing', label: 'Clothing', icon: 'shopping-bag' },
  { key: 'groceries', label: 'Groceries', icon: 'shopping-basket' },
  { key: 'sports', label: 'Sports', icon: 'futbol-o' },
];


export default function HomeScreen() {
  const { addToCart } = useCart();
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState('all');
  const [cartCount, setCartCount] = useState(0);
  const [showCartBar, setShowCartBar] = useState(false);

  const [sizeModalVisible, setSizeModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ✅ This is the ONLY search state used for filtering
  const [searchQuery, setSearchQuery] = useState('');

  const [menuVisible, setMenuVisible] = useState(false);

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;

    if (activeCategory !== 'all') {
      list = list.filter((item) => item.category === activeCategory);
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((item) => item.name.toLowerCase().includes(q));
    }

    return list;
  }, [activeCategory, searchQuery]);

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

  const handleGoToCart = () => {
    router.push('/cart');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <Text style={styles.productName} numberOfLines={2}>
        {item.name}
      </Text>

      <View style={styles.ratingRow}>
        <FontAwesome name="star" size={12} color="#f59e0b" />
        <Text style={styles.ratingText}>
          {(item.rating ?? (4 + (item.id % 2) * 0.5)).toFixed(1)}
        </Text>
        <Text style={styles.reviewsText}>
          ({item.reviews ?? (5 + (item.id % 20))} reviews)
        </Text>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {item.description ||
          `${item.name} — a trusted ${item.category} choice with great value and reliable performance.`}
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

  const ListHeader = () => (
    <View>
      <View style={styles.homeHeader}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setMenuVisible(true)}
          activeOpacity={0.7}
        >
          <FontAwesome name="bars" size={20} color="#111827" />
        </TouchableOpacity>

        {/* Center: brand + search */}
        <View style={styles.headerCenter}>
          <Text style={styles.brandText}>
            <Text style={styles.brandEasy}>Easy</Text>
            <Text style={styles.brandBuy}>Buy</Text>
          </Text>

          {/* Search Bar controlled by onSubmitEditing to update searchQuery */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#9ca3af"
            returnKeyType="search"
            onSubmitEditing={(e) => {
              const text = e.nativeEvent.text || '';
              setSearchQuery(text);
            }}
          />
        </View>

        <View style={{ width: 24 }} />
      </View>

      {/* Category chips */}
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
      <View style={styles.sectionSeparator} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={3}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />

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

        {/* Menu modal (unchanged) */}
        <Modal
          visible={menuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <Pressable
            style={styles.menuOverlay}
            onPress={() => setMenuVisible(false)}
          >
            <View style={styles.menuContainer}>
              <Text style={styles.menuTitle}>Menu</Text>

              {['My Profile', 'My Orders', 'Wishlist', 'Help & Support', 'Logout'].map((label) => (
                <Pressable
                  key={label}
                  style={styles.menuItem}
                  onPress={() => {
                    setMenuVisible(false);
                    if (label === 'My Profile') {
                      router.push('/profile');
                    }
                  }}
                >
                  <Text style={styles.menuItemText}>{label}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>

        {/* Size selection modal */}
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
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  homeHeader: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  brandText: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
    color: '#111827',
  },
  brandEasy: {
    color: '#111827',
  },
  brandBuy: {
    color: '#2563eb',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  searchInput: {
    marginTop: 6,
    width: '100%',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    fontSize: 13,
    color: '#111827',
  },

  categorySection: {
    paddingTop: 10,
    paddingBottom: 6,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingRight: 0,
  },
  stickyCategoryBackground: {
    backgroundColor: '#f3f4f6',
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  sectionSeparator: {
    height: 10,
    backgroundColor: '#f3f4f6',
    marginHorizontal: -16,
  },
  categoryScroll: {
    paddingRight: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
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
  listContent: {
    paddingBottom: 120,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    width: '31%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    minHeight: 260,
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 6,
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
    minHeight: 30,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginLeft: 6,
  },
  reviewsText: {
    fontSize: 11,
    color: '#6b7280',
    marginLeft: 6,
  },
  description: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 4,
    minHeight: 32,
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
    color: '#1f2937',
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: '#1d78c3ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ef4444',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cartBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: '#1f2937',
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

  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuContainer: {
    marginTop: 70,
    marginLeft: 16,
    width: 220,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 6,
  },
  menuItem: {
    paddingVertical: 8,
  },
  menuItemText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
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
    paddingBottom: 40,
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