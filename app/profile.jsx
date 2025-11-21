import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React from 'react';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function Profile() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>User Profile</Text>
      </View>

      {/* PROFILE SECTION */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
          style={styles.avatar}
        />

        <View>
          <Text style={styles.name}>user</Text>
          <Text style={styles.email}>user@example.com</Text>
        </View>
      </View>

      {/* ACCOUNT OPTIONS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <Option
          icon={<Ionicons name="person-outline" size={20} />}
          label="Edit Profile"
        />
        <Option
          icon={<MaterialIcons name="location-on" size={20} />}
          label="My Addresses"
        />
        <Option
          icon={<Ionicons name="notifications-outline" size={20} />}
          label="Notifications"
        />
      </View>

      {/* ORDERS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Orders</Text>

        <Option
          icon={<FontAwesome5 name="shopping-bag" size={18} />}
          label="My Orders"
        />
        <Option
          icon={<MaterialIcons name="payment" size={20} />}
          label="Payment Methods"
        />
        <Option
          icon={<Ionicons name="reload-circle-outline" size={22} />}
          label="Refund & Returns"
        />
      </View>

      {/* HELP */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>

        <Option
          icon={<Ionicons name="help-circle-outline" size={20} />}
          label="Help & Support"
        />
        <Option
          icon={<Ionicons name="shield-checkmark-outline" size={22} />}
          label="Privacy Policy"
        />
      </View>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

// OPTION COMPONENT
const Option = ({ icon, label }) => (
  <TouchableOpacity style={styles.option}>
    {icon}
    <Text style={styles.optionText}>{label}</Text>
    <Ionicons name="chevron-forward" size={18} color="#555" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },

  header: {
    paddingVertical: 18,
    backgroundColor: '#111',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 3,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 50,
    marginRight: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  email: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },

  section: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 14,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#333',
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 50,
    justifyContent: 'center',
    backgroundColor: '#FFECEC',
  },
  logoutText: {
    color: '#EF4444',
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
  },
});