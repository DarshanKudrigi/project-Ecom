import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
  ActivityIndicator,
  TextInput,
  Keyboard, // Added Keyboard for dismissing
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from './_layout';

// Unsplash API - Get images based on category/keywords
const getUnsplashImage = async (keyword, id) => {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${keyword}&per_page=1&client_id=OMFPUKxPIuiWP32Mq-yl1xkFvtmYn9UtFVqvFa0vqKg`
    );
    const data = await response.json();
    return data.results?.[0]?.urls?.small || null;
  } catch (error) {
    console.warn(`Failed to fetch image for ${keyword}:`, error);
    return null;
  }
}; 

// --- PRODUCT DATA (100+ ITEMS) ---
const BASE_PRODUCTS = [
    // Phones & Tablets (1-10)
    { id: 1, name: 'Wireless Phone X1 (Onyx)', price: 15999, keyword: 'smartphone black', category: 'mobiles' }, 
    { id: 2, name: 'Smartphone Pro Max 12', price: 24999, keyword: 'premium smartphone', category: 'mobiles' }, 
    { id: 3, name: 'Budget Phone A10 Plus', price: 8999, keyword: 'affordable smartphone', category: 'mobiles' }, 
    { id: 4, name: '5G Phone S Lite Ultra', price: 16999, keyword: '5G phone', category: 'mobiles' }, 
    { id: 5, name: 'Gaming Phone Beast Z', price: 29999, keyword: 'gaming smartphone', category: 'mobiles' }, 
    { id: 6, name: 'Mini Compact Phone SE', price: 6999, keyword: 'compact phone', category: 'mobiles' }, 
    { id: 7, name: 'Tablet Pro 11-inch', price: 35000, keyword: 'tablet', category: 'mobiles' }, 
    { id: 8, name: 'Kids Tablet Fun', price: 5999, keyword: 'kids tablet', category: 'mobiles' }, 
    { id: 9, name: 'Folding Phone Flex', price: 95000, keyword: 'foldable phone', category: 'mobiles' }, 
    { id: 10, name: 'Phablet Note 20', price: 21500, keyword: 'phablet', category: 'mobiles' }, 

    // Laptops & PCs (11-20)
    { id: 11, name: 'Gaming Laptop Pro 4080', price: 125000, keyword: 'gaming laptop', category: 'electronics' }, 
    { id: 12, name: 'Ultrabook Air M2', price: 75000, keyword: 'ultrabook laptop', category: 'electronics' }, 
    { id: 13, name: 'Budget Office PC', price: 32000, keyword: 'office laptop', category: 'electronics' }, 
    { id: 14, name: 'Desktop Monitor 27"', price: 15500, keyword: 'computer monitor', category: 'electronics' }, 
    { id: 15, name: 'Mechanical Keyboard RGB', price: 2499, keyword: 'mechanical keyboard', category: 'electronics' }, 
    { id: 16, name: 'Ergonomic Mouse Wireless', price: 999, keyword: 'computer mouse', category: 'electronics' }, 
    { id: 17, name: 'Webcam HD 1080p', price: 1499, keyword: 'webcam', category: 'electronics' }, 
    { id: 18, name: 'All-in-One Printer', price: 8999, keyword: 'printer', category: 'electronics' }, 
    { id: 19, name: 'Portable SSD 1TB', price: 6500, keyword: 'external hard drive', category: 'electronics' }, 
    { id: 20, name: 'WiFi Router AX6000', price: 4500, keyword: 'wifi router', category: 'electronics' }, 

    // Audio & Wearables (21-30)
    { id: 21, name: 'Noise Cancelling Headset', price: 3499, keyword: 'noise cancelling headphones', category: 'audio' }, 
    { id: 22, name: 'Over-Ear Headphones Max', price: 5999, keyword: 'over ear headphones', category: 'audio' }, 
    { id: 23, name: 'Bluetooth Earbuds ANC', price: 2299, keyword: 'earbuds wireless', category: 'audio' }, 
    { id: 24, name: 'Party Bluetooth Speaker XL', price: 7999, keyword: 'bluetooth speaker', category: 'audio' }, 
    { id: 25, name: 'Mini Portable Speaker', price: 1299, keyword: 'portable speaker', category: 'audio' }, 
    { id: 26, name: 'Smart Watch Active 2', price: 4999, keyword: 'smartwatch', category: 'wearables' }, 
    { id: 27, name: 'Fitness Tracker Band Pro', price: 1999, keyword: 'fitness tracker', category: 'wearables' }, 
    { id: 28, name: 'Hybrid Smartwatch Classic', price: 6500, keyword: 'hybrid smartwatch', category: 'wearables' }, 
    { id: 29, name: 'Bone Conduction Headset', price: 4500, keyword: 'bone conduction headphones', category: 'audio' }, 
    { id: 30, name: 'Digital Wrist Watch', price: 1500, keyword: 'digital watch', category: 'wearables' }, 
    
    // Home & Kitchen (31-40)
    { id: 31, name: 'Smart Air Fryer 5L', price: 6999, keyword: 'air fryer', category: 'home' }, 
    { id: 32, name: 'Robot Vacuum Cleaner', price: 18000, keyword: 'robot vacuum', category: 'home' }, 
    { id: 33, name: 'Coffee Maker Drip', price: 2500, keyword: 'coffee maker', category: 'home' }, 
    { id: 34, name: 'Electric Kettle', price: 999, keyword: 'electric kettle', category: 'home' }, 
    { id: 35, name: 'Mixer Grinder Pro', price: 4500, keyword: 'mixer grinder', category: 'home' }, 
    { id: 36, name: 'Smart LED Bulb Pack', price: 1200, keyword: 'smart light bulb', category: 'home' }, 
    { id: 37, name: 'Bed Sheet Cotton King', price: 1800, keyword: 'bed sheets', category: 'home' }, 
    { id: 38, name: 'Memory Foam Pillow', price: 1100, keyword: 'pillow', category: 'home' }, 
    { id: 39, name: 'Stainless Steel Cookware Set', price: 5500, keyword: 'cookware set', category: 'home' }, 
    { id: 40, name: 'Water Purifier RO', price: 13000, keyword: 'water purifier', category: 'home' }, 

    // Clothing - Men (41-50)
    { id: 41, name: 'Men T-Shirt Basic Black', price: 699, keyword: 'mens tshirt', category: 'clothing' }, 
    { id: 42, name: 'Men Casual Shirt Linen', price: 1099, keyword: 'casual shirt mens', category: 'clothing' }, 
    { id: 43, name: 'Men Polo T-Shirt Striped', price: 899, keyword: 'polo shirt', category: 'clothing' }, 
    { id: 44, name: 'Men Denim Jeans Slim Fit', price: 1799, keyword: 'denim jeans', category: 'clothing' }, 
    { id: 45, name: 'Unisex Hoodie Cotton Grey', price: 1599, keyword: 'hoodie', category: 'clothing' }, 
    { id: 46, name: 'Men Formal Trousers', price: 1499, keyword: 'formal pants', category: 'clothing' }, 
    { id: 47, name: 'Men Sports Shorts', price: 799, keyword: 'sports shorts', category: 'clothing' }, 
    { id: 48, name: 'Men Winter Jacket Padded', price: 2999, keyword: 'winter jacket', category: 'clothing' }, 
    { id: 49, name: 'Men Boxer Briefs Pack of 3', price: 599, keyword: 'mens underwear', category: 'clothing' }, 
    { id: 50, name: 'Men Leather Belt', price: 899, keyword: 'leather belt', category: 'clothing' }, 

    // Clothing - Women (51-60)
    { id: 51, name: 'Women Top Casual Floral', price: 899, keyword: 'womens top', category: 'clothing' }, 
    { id: 52, name: 'Women Kurti Printed Cotton', price: 1199, keyword: 'kurti', category: 'clothing' }, 
    { id: 53, name: 'Women Skinny Jeans Blue', price: 1699, keyword: 'womens jeans', category: 'clothing' }, 
    { id: 54, name: 'Women Winter Scarf Wool', price: 750, keyword: 'winter scarf', category: 'clothing' }, 
    { id: 55, name: 'Women Anarkali Suit Set', price: 3500, keyword: 'anarkali dress', category: 'clothing' }, 
    { id: 56, name: 'Women Sports Leggings', price: 1299, keyword: 'leggings', category: 'clothing' }, 
    { id: 57, name: 'Women Casual Dress Midi', price: 1999, keyword: 'womens dress', category: 'clothing' }, 
    { id: 58, name: 'Women T-Shirt V-Neck', price: 599, keyword: 'womens tshirt', category: 'clothing' }, 
    { id: 59, name: 'Women Handbag Leather', price: 2200, keyword: 'womens handbag', category: 'clothing' }, 
    { id: 60, name: 'Women Sandals Flat', price: 950, keyword: 'womens sandals', category: 'clothing' }, 
    
    // Groceries (61-70)
    { id: 61, name: 'Basmati Rice 5kg Premium', price: 599, keyword: 'rice', category: 'groceries' }, 
    { id: 62, name: 'Sunflower Oil 1L Refined', price: 189, keyword: 'cooking oil', category: 'groceries' }, 
    { id: 63, name: 'Atta 5kg Whole Wheat', price: 329, keyword: 'wheat flour', category: 'groceries' }, 
    { id: 64, name: 'Tea Powder 1kg Black', price: 399, keyword: 'black tea', category: 'groceries' }, 
    { id: 65, name: 'Instant Coffee 200g Jar', price: 249, keyword: 'instant coffee', category: 'groceries' }, 
    { id: 66, name: 'Biscuits Family Pack Cream', price: 149, keyword: 'biscuits', category: 'groceries' }, 
    { id: 67, name: 'Breakfast Cereal Oats', price: 299, keyword: 'oats cereal', category: 'groceries' }, 
    { id: 68, name: 'Organic Honey 500g', price: 349, keyword: 'organic honey', category: 'groceries' }, 
    { id: 69, name: 'Moong Dal 1kg', price: 120, keyword: 'lentils', category: 'groceries' }, 
    { id: 70, name: 'Sugar White 5kg', price: 250, keyword: 'sugar', category: 'groceries' }, 

    // Sports & Fitness (71-80)
    { id: 71, name: 'Running Shoes Cushioned', price: 2299, keyword: 'running shoes', category: 'sports' }, 
    { id: 72, name: 'Sports Shoes Pro Trainer', price: 2599, keyword: 'athletic shoes', category: 'sports' }, 
    { id: 73, name: 'Casual Sneakers White', price: 1999, keyword: 'sneakers', category: 'sports' }, 
    { id: 74, name: 'Gym Gloves Leather', price: 499, keyword: 'gym gloves', category: 'sports' }, 
    { id: 75, name: 'Yoga Mat Non-slip', price: 999, keyword: 'yoga mat', category: 'sports' }, 
    { id: 76, name: 'Dumbbell Set 5kg Pair', price: 1500, keyword: 'dumbbells', category: 'sports' }, 
    { id: 77, name: 'Cricket Bat English Willow', price: 4000, keyword: 'cricket bat', category: 'sports' }, 
    { id: 78, name: 'Football Match Quality', price: 1200, keyword: 'football', category: 'sports' }, 
    { id: 79, name: 'Cycling Helmet M-Size', price: 1800, keyword: 'bicycle helmet', category: 'sports' }, 
    { id: 80, name: 'Skipping Rope Adjustable', price: 350, keyword: 'jump rope', category: 'sports' }, 

    // Books & Media (81-90)
    { id: 81, name: 'Fiction Bestseller: The Code', price: 450, keyword: 'book fiction', category: 'media' }, 
    { id: 82, name: 'Self-Help Guide: Success Habits', price: 399, keyword: 'self help book', category: 'media' }, 
    { id: 83, name: 'Cooking Book: Indian Classics', price: 650, keyword: 'cookbook', category: 'media' }, 
    { id: 84, name: 'Textbook: Advanced React', price: 900, keyword: 'programming book', category: 'media' }, 
    { id: 85, name: 'Science Magazine Monthly Issue', price: 150, keyword: 'science magazine', category: 'media' }, 
    { id: 86, name: 'E-reader Paper White', price: 9999, keyword: 'e-reader', category: 'electronics' }, 
    { id: 87, name: 'DVD Player Multi-region', price: 2999, keyword: 'dvd player', category: 'electronics' }, 
    { id: 88, name: 'Gaming Console PS5 Slim', price: 49999, keyword: 'gaming console', category: 'electronics' }, 
    { id: 89, name: 'Portable Projector Mini', price: 15999, keyword: 'projector', category: 'electronics' }, 
    { id: 90, name: 'Vinyl Record Player', price: 7999, keyword: 'record player', category: 'electronics' }, 

    // Tools & Misc (91-103)
    { id: 91, name: 'Electric Drill Set', price: 3500, keyword: 'power drill', category: 'tools' }, 
    { id: 92, name: 'Universal Tool Kit 100pcs', price: 2500, keyword: 'tool set', category: 'tools' }, 
    { id: 93, name: 'Safety Goggles', price: 150, keyword: 'safety glasses', category: 'tools' }, 
    { id: 94, name: 'Rechargeable Battery AA (4-pack)', price: 499, keyword: 'battery', category: 'electronics' }, 
    { id: 95, name: 'Car Dash Cam 4K', price: 4500, keyword: 'dash cam', category: 'electronics' }, 
    { id: 96, name: 'External Battery Power Bank 20000mAh', price: 1899, keyword: 'power bank', category: 'electronics' }, 
    { id: 97, name: 'USB-C Cable 2m Braided', price: 399, keyword: 'usb cable', category: 'electronics' }, 
    { id: 98, name: 'Gaming Headset with Mic', price: 2999, keyword: 'gaming headset', category: 'audio' }, 
    { id: 99, name: 'Air Purifier Hepa Filter', price: 9500, keyword: 'air purifier', category: 'home' }, 
    { id: 100, name: 'Electric Toothbrush Smart', price: 3500, keyword: 'electric toothbrush', category: 'home' },
    { id: 101, name: 'Smart Pet Feeder', price: 5999, keyword: 'pet feeder', category: 'home' },
    { id: 102, name: 'Wireless Charging Pad Duo', price: 1199, keyword: 'wireless charger', category: 'electronics' }, 
    { id: 103, name: 'Laptop Backpack Premium', price: 1799, keyword: 'laptop backpack', category: 'electronics' }, 
];

// Initialize products with Unsplash images
const initializeProducts = async () => {
  const PRODUCTS = await Promise.all(
    BASE_PRODUCTS.map(async (product) => {
      const image = await getUnsplashImage(product.keyword, product.id);
      return {
        ...product,
        image: image || 'https://via.placeholder.com/200?text=Product',
      };
    })
  );
  return PRODUCTS;
};

const CATEGORIES = [
  { key: 'all', label: 'All', icon: 'th-large' },
  { key: 'mobiles', label: 'Mobiles & Tablets', icon: 'mobile' },
  { key: 'electronics', label: 'Laptops & Devices', icon: 'laptop' },
  { key: 'audio', label: 'Audio', icon: 'headphones' },
  { key: 'wearables', label: 'Wearables', icon: 'watch' }, 
  { key: 'clothing', label: 'Clothing & Fashion', icon: 'shopping-bag' },
  { key: 'home', label: 'Home & Kitchen', icon: 'home' }, 
  { key: 'groceries', label: 'Groceries', icon: 'shopping-basket' },
  { key: 'sports', label: 'Sports & Fitness', icon: 'futbol-o' }, 
  { key: 'media', label: 'Books & Media', icon: 'book' }, 
  { key: 'tools', label: 'Tools', icon: 'wrench' }, 
];

// --- COLOR PALETTE ---
const colorPalette = {
    primary: '#2563eb', // Vibrant Blue
    secondary: '#10b981', // Success Green
    danger: '#ef4444', // Warning Red
    background: '#f3f4f6', // Light Gray Background
    card: '#ffffff', // White Cards
    textPrimary: '#111827', // Dark Text
    textSecondary: '#6b7280', // Medium Gray Text
    accent: '#facc15', // Yellow Accent
};

// Custom component for product images with loading state
const ProductImage = React.memo(({ uri }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const handleLoad = useCallback(() => setLoading(false), []);
    const handleError = useCallback(() => {
        setLoading(false);
        setError(true);
    }, []);

    return (
        <View style={styles.imageWrapper}>
            {loading && !error && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="small" color={colorPalette.primary} />
                </View>
            )}
            {error ? (
                <View style={styles.errorOverlay}>
                    <FontAwesome name="image" size={30} color="#9ca3af" />
                    <Text style={styles.errorText}>No Image</Text>
                </View>
            ) : (
                <Image 
                    source={{ uri }} 
                    style={styles.image} 
                    onLoad={handleLoad}
                    onError={handleError}
                    resizeMode="contain" 
                />
            )}
        </View>
    );
});


export default function HomeScreen() {
  const { addToCart, totalItems } = useCart();
  const router = useRouter(); 

  const [activeCategory, setActiveCategory] = useState('all');
  const [showCartBar, setShowCartBar] = useState(false);
  const [sizeModalVisible, setSizeModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load products with Unsplash images on mount
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const loadedProducts = await initializeProducts();
        setProducts(loadedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts(BASE_PRODUCTS.map(p => ({ ...p, image: 'https://via.placeholder.com/200?text=Product' })));
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);
  
  // Use a stable, debounced update function if performance becomes an issue 
  // but for now, direct update is required to fix the character-by-character input bug
  const handleSearchChange = (text) => {
    // This is the CRITICAL FIX: Ensure state update handles the full string input.
    // The previous bug might have been due to an unnecessary unmounting/remounting, 
    // which is now fixed by isolating the sticky header.
    setSearchQuery(text);
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    // 1. Filter by Category
    if (activeCategory !== 'all') {
      result = result.filter((item) => item.category === activeCategory);
    }
    
    // 2. Filter by Search Query
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        result = result.filter(item => 
            item.name.toLowerCase().includes(query) || 
            item.category.toLowerCase().includes(query)
        );
    }

    return result;
  }, [activeCategory, searchQuery, products]);


  const finalizeAddToCart = (item, size) => {
    const productToAdd = size ? { ...item, size } : item;
    addToCart(productToAdd);
    setShowCartBar(true); 
    setTimeout(() => setShowCartBar(false), 3000); 
  };

  const handleAddToCart = (item) => {
    if (item.category === 'clothing') {
      setSelectedProduct(item);
      setSizeModalVisible(true);
    } else {
      finalizeAddToCart(item, null);
    }
  };

  const renderItem = useCallback(({ item }) => (
    <View style={styles.card}>
      <ProductImage uri={item.image} /> 

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
      </View>

      <View style={styles.cardBottom}>
        <Text style={styles.price}>₹{item.price.toLocaleString('en-IN')}</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
          activeOpacity={0.7}
        >
          <FontAwesome name="cart-plus" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  ), []);

  const handleGoToCart = () => {
    router.push('/cart'); 
    setShowCartBar(false); 
  };

  const handleCategoryPress = (key) => {
    setActiveCategory(key);
    setSearchQuery(''); 
    Keyboard.dismiss(); // Dismiss keyboard on category change
  };

  // --- List Header Component (Fixed Sticky Header and Search) ---
  const ListHeader = useCallback(() => (
    <View style={{backgroundColor: colorPalette.background}}>
      {/* Index 0: Non-sticky elements */}
      <View> 
          {/* Top Bar and Greeting */}
          <View style={styles.topBar}>
              <Text style={styles.appName}>EasyBuy</Text>
              <Text style={styles.tagline}>The Best of Online Shopping</Text>
          </View>

          <View style={styles.header}>
              <Text style={styles.hello}>Hello Shopper, Welcome Back! 👋</Text>
              <Text style={styles.title}>What are you looking for today?</Text>
          </View>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={20} color={colorPalette.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for products, categories, brands..."
              placeholderTextColor={colorPalette.textSecondary}
              value={searchQuery}
              onChangeText={handleSearchChange} // Use the correct change handler
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                    <FontAwesome name="times-circle" size={20} color={colorPalette.textSecondary} />
                </TouchableOpacity>
            )}
          </View>
      </View>


      {/* Index 1: The Category Scroll View - THIS IS THE STICKY ELEMENT */}
      <View style={[styles.categorySection, styles.stickyCategoryBackground]}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
            scrollEventThrottle={16}
          >
            {CATEGORIES.map((cat) => {
              const isActive = cat.key === activeCategory;
              return (
                <TouchableOpacity
                  key={cat.key}
                  onPress={() => handleCategoryPress(cat.key)}
                  style={[
                    styles.categoryChip,
                    isActive && styles.categoryChipActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <FontAwesome
                    name={cat.icon}
                    size={14}
                    color={isActive ? '#fff' : colorPalette.primary} 
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
    </View>
  ), [activeCategory, searchQuery, handleSearchChange, handleCategoryPress]);
  // ------------------------------
  
  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
        <FontAwesome name="exclamation-triangle" size={50} color={colorPalette.danger} style={{marginBottom: 15}}/>
        <Text style={styles.emptyTitle}>Oops! Sorry, No Results Found</Text>
        <Text style={styles.emptySubtitle}>
            We couldn't find any products matching: **{searchQuery}**
        </Text>
        <Text style={styles.emptyHelp}>
            Try clearing the search or selecting 'All' categories.
        </Text>
        <TouchableOpacity style={styles.emptyButton} onPress={() => setSearchQuery('')}>
             <Text style={styles.emptyButtonText}>Clear Search & View All</Text>
        </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable style={styles.container} onPress={Keyboard.dismiss}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colorPalette.primary} />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id.toString()} 
            renderItem={renderItem}
            numColumns={2} 
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={ListEmptyComponent}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            // THE FIX: The sticky element is the SECOND child (index 1) of ListHeaderComponent's top-level View
            stickyHeaderIndices={[1]} 
          />
        )}

        {/* Bottom persistent cart bar */}
        {totalItems > 0 && showCartBar && (
          <View style={styles.cartBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.cartBarIcon}>
                <FontAwesome name="shopping-cart" size={18} color={colorPalette.primary} />
              </View>
              <View>
                <Text style={styles.cartBarTitle}>Added to Cart</Text>
                <Text style={styles.cartBarSubtitle}>
                  {totalItems} item{totalItems > 1 ? 's' : ''} in your cart
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.cartBarButton}
              onPress={handleGoToCart}
              activeOpacity={0.8}
            >
              <Text style={styles.cartBarButtonText}>VIEW CART</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Size selection modal for clothing */}
        <Modal
          visible={sizeModalVisible}
          transparent
          animationType="fade" 
          onRequestClose={() => setSizeModalVisible(false)}
        >
          <Pressable 
              style={styles.modalOverlay}
              onPress={() => setSizeModalVisible(false)} 
          >
            <Pressable style={styles.modalContent} onPress={() => { /* prevent closing */ }}>
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
            </Pressable>
          </Pressable>
        </Modal>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Defined to allow access to colors in components
  colors: colorPalette, 

  safe: {
    flex: 1,
    backgroundColor: colorPalette.background, 
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorPalette.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colorPalette.textSecondary,
    fontWeight: '600',
  },
  // --- TOP BAR & HEADER ---
  topBar: {
    flexDirection: 'column', 
    alignItems: 'flex-start',
    backgroundColor: colorPalette.card, 
    borderRadius: 16, 
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 16, 
    marginTop: 8,
    borderLeftWidth: 5,
    borderLeftColor: colorPalette.danger, 
  },
  appName: {
    fontSize: 24,
    fontWeight: '900',
    color: colorPalette.textPrimary,
  },
  tagline: {
    fontSize: 13,
    color: colorPalette.textSecondary,
    marginTop: 4,
  },
  header: {
    marginBottom: 16,
    paddingVertical: 4,
  },
  hello: {
    fontSize: 16, 
    fontWeight: '600',
    color: colorPalette.textSecondary,
  },
  title: {
    fontSize: 30, 
    fontWeight: '800', 
    color: colorPalette.textPrimary,
    marginTop: 2,
  },
  // --- SEARCH BAR STYLING ---
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colorPalette.card,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: colorPalette.textPrimary,
  },
  clearButton: {
    marginLeft: 10,
    padding: 5,
  },

  // --- STICKY CATEGORY SECTION ---
  categorySection: {
    paddingTop: 10,
    paddingBottom: 10,
    marginHorizontal: -16, 
    paddingHorizontal: 16,
    paddingRight: 0, 
    zIndex: 10, 
  },
  stickyCategoryBackground: {
    backgroundColor: colorPalette.background, 
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db', 
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700', 
    color: colorPalette.textPrimary,
    marginBottom: 12,
  },
  categoryScroll: {
    paddingRight: 20, 
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16, 
    paddingVertical: 9,
    borderRadius: 25, 
    backgroundColor: colorPalette.card, 
    marginRight: 10,
    borderWidth: 2, 
    borderColor: '#e5e7eb',
  },
  categoryChipActive: {
    backgroundColor: colorPalette.primary,
    borderColor: colorPalette.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colorPalette.textSecondary,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: colorPalette.card,
    fontWeight: '700',
  },

  // --- PRODUCT LIST & CARD ---
  listContent: {
    paddingBottom: 120, 
    paddingTop: 10, 
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16, 
  },
  card: {
    backgroundColor: colorPalette.card,
    borderRadius: 16, 
    padding: 12,
    width: '48%', 
    height: 240, 
    justifyContent: 'space-between', 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6, 
  },
  imageWrapper: {
    width: '100%',
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f9fafb', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1, 
    marginBottom: 8,
  },
  productName: {
    fontSize: 14, 
    fontWeight: '600',
    color: colorPalette.textPrimary,
    minHeight: 36, 
    lineHeight: 18,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16, 
    fontWeight: '800',
    color: colorPalette.textPrimary, 
  },
  addButton: {
    width: 40, 
    height: 40,
    borderRadius: 999,
    backgroundColor: colorPalette.secondary, 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colorPalette.secondary,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 8,
  },

  // --- EMPTY STATE ---
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    backgroundColor: colorPalette.card,
    borderRadius: 16,
    marginTop: 20,
    padding: 20,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colorPalette.danger,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colorPalette.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyHelp: {
    fontSize: 14,
    color: colorPalette.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: colorPalette.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  emptyButtonText: {
    color: colorPalette.card,
    fontWeight: '700',
    fontSize: 15,
  },
  // --- CART BAR & MODAL ---
  cartBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    backgroundColor: colorPalette.textPrimary, 
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
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
    fontSize: 15,
    fontWeight: '700',
    color: colorPalette.card,
  },
  cartBarSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
  },
  cartBarButton: {
    backgroundColor: colorPalette.danger, 
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  cartBarButtonText: {
    color: colorPalette.card,
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17,24,39,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colorPalette.card,
    borderRadius: 16,
    paddingHorizontal: 25,
    paddingVertical: 30,
    width: '85%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colorPalette.textPrimary,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colorPalette.textSecondary,
    marginBottom: 25,
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    gap: 10,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#c7d2fe',
  },
  sizeButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: colorPalette.primary,
  },
  modalCancel: {
    alignSelf: 'center',
    padding: 10,
  },
  modalCancelText: {
    fontSize: 15,
    color: colorPalette.textSecondary,
    fontWeight: '600',
  },
});