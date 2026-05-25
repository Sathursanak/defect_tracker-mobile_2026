import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { premiumNav, premiumShadowsNav, premiumRadius } from '../theme/premiumTheme';

interface FooterProps {
  style?: ViewStyle;
}

type FooterTab = 'home' | 'defects' | '';

const Footer: React.FC<FooterProps> = ({ style }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<FooterTab>('');

  useEffect(() => {
    if (route.name === 'Dashboard') {
      setActiveTab('home');
    } else if (route.name === 'Defects') {
      setActiveTab('defects');
    } else {
      setActiveTab('');
    }
  }, [route.name]);

  const handleTabPress = (tabName: FooterTab, onPress?: () => void) => {
    setActiveTab(tabName);
    if (onPress) {
      onPress();
    }
  };

  const handleHomePress = () => {
    handleTabPress('home', () => {
      (navigation as { navigate: (screen: string) => void }).navigate('Dashboard');
    });
  };

  const handleDefectsPress = () => {
    handleTabPress('defects', () => {
      (navigation as { navigate: (screen: string) => void }).navigate('Defects');
    });
  };

  const showDefectsTab = route.name !== 'Dashboard';

  const renderTab = (
    tab: FooterTab,
    label: string,
    iconFocused: string,
    iconOutline: string,
    onPress: () => void,
  ) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
        style={[styles.tab, isActive && styles.tabActive]}
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
      >
        <Ionicons
          name={isActive ? iconFocused : iconOutline}
          size={22}
          color={isActive ? premiumNav.tabActiveIcon : premiumNav.tabInactiveIcon}
        />
        <Text
          style={[
            styles.tabLabel,
            isActive ? styles.tabLabelActive : styles.tabLabelInactive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.footerOuter, premiumShadowsNav.footer, style]}>
      <LinearGradient
        colors={premiumNav.footerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.footerGradient, { paddingBottom: Math.max(insets.bottom, 12) }]}
      >
        <View style={styles.tabRow}>
          {renderTab('home', 'Home', 'home', 'home-outline', handleHomePress)}
          {showDefectsTab &&
            renderTab('defects', 'Defects', 'bug', 'bug-outline', handleDefectsPress)}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  footerOuter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderTopLeftRadius: premiumRadius.footer,
    borderTopRightRadius: premiumRadius.footer,
    overflow: 'hidden',
  },
  footerGradient: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: premiumRadius.tab,
    minWidth: 88,
  },
  tabActive: {
    backgroundColor: premiumNav.tabActiveBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: premiumNav.tabActiveIcon,
  },
  tabLabelInactive: {
    color: premiumNav.tabInactiveLabel,
  },
});

export default Footer;
