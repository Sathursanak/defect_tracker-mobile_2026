import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import NotificationBell from './NotificationBell';
import Profile from './Profile';

interface FooterProps {
  style?: ViewStyle;
}

const Footer: React.FC<FooterProps> = ({ style }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState<'home' | ''>('');

  // Update active tab based on current route
  useEffect(() => {
    if (route.name === 'Dashboard') {
      setActiveTab('home');
    } else {
      setActiveTab('');
    }
  }, [route.name]);

  const handleTabPress = (tabName: string, onPress?: () => void) => {
    setActiveTab(tabName);

    // Execute navigation immediately for better responsiveness
    if (onPress) {
      onPress();
    }
  };

  const handleHomePress = () => {
    handleTabPress('home', () => {
      (navigation as any).navigate('Dashboard');
    });
  };

  return (
    <View style={[styles.footerWrapper, style]}>
      <TouchableOpacity
        style={[styles.iconButton, activeTab === 'home' && styles.activeButton]}
        onPress={handleHomePress}
        activeOpacity={0.6}
      >
        <Ionicons
          name={activeTab === 'home' ? 'home' : 'home-outline'}
          size={24}
          color="#ffffff"
        />
        <Text style={styles.iconLabel}>Home</Text>
      </TouchableOpacity>

      {/* <View
        style={[
          styles.iconButton,
          activeTab === 'notifications' && styles.activeButton,
        ]}
      >
        <NotificationBell iconColor="#ffffff" />
        <Text style={styles.iconLabel}>Notifications</Text>
      </View> */}

      <View
        style={[
          styles.iconButton,
          activeTab === 'profile' && styles.activeButton,
        ]}
      >
        <Profile iconColor="#ffffff" />
        <Text style={styles.iconLabel}>Profile</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#60A5FA', // Theme color
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Changed from space-around to space-evenly
    alignItems: 'center',
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 8,
    zIndex: 1000,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8, // Reduced padding to give more space for text
    borderRadius: 8,
    backgroundColor: 'transparent',
    width: 90, // Increased width to accommodate full text
    height: 60, // Fixed height for consistency
  },

  activeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle highlight for active state
    borderRadius: 8,
  },
  iconLabel: {
    fontSize: 9, // Smaller font to fit full text
    color: '#ffffff', // White text
    marginTop: 3, // Reduced margin
    fontWeight: '500',
    textAlign: 'center',
    flexShrink: 0, // Prevent shrinking
    width: '100%', // Use full width available
    paddingHorizontal: 2, // Small padding to prevent edge cutoff
  },
});

export default Footer;
