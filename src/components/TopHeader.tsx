import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LogoutButton from './LogoutButton';

interface TopHeaderProps {
  title?: string;
  style?: ViewStyle;
  backgroundColor?: string;
  titleColor?: string;
  iconColor?: string;
  onBackPress?: () => void;
  showLogout?: boolean;
  rightActionIcon?: string;
  rightActionColor?: string;
  onRightActionPress?: () => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  style,
  backgroundColor = '#ffffff',
  titleColor = '#3b82f6',
  onBackPress,
  showLogout,
  rightActionIcon,
  rightActionColor = '#3b82f6',
  onRightActionPress,
}) => {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={backgroundColor}
        translucent={false}
      />
      <View style={[styles.container, { backgroundColor }, style]}>
        <View style={styles.content}>
          {/* Center - App icon and title */}
          <View style={styles.centerSection}>
            {onBackPress && (
              <TouchableOpacity onPress={onBackPress} style={styles.headerBackButton}>
                <Ionicons name="arrow-back-outline" size={28} color="#3b82f6" />
              </TouchableOpacity>
            )}
            <View
              style={[styles.appIconContainer, { backgroundColor: '#3b82f6' }]}
            >
              <Ionicons name="bug-outline" size={28} color="#ffffff" />
            </View>
            {title && (
              <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
            )}
          </View>
          {showLogout ? (
            <LogoutButton
              style={styles.rightAction}
              iconColor={rightActionColor}
            />
          ) : rightActionIcon && onRightActionPress ? (
            <TouchableOpacity
              style={styles.rightAction}
              onPress={onRightActionPress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={rightActionIcon}
                size={24}
                color={rightActionColor}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: Platform.OS === 'ios' ? 44 : 0, // Account for status bar on iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  rightAction: {
    position: 'absolute',
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
  },
  headerBackButton: {
    marginRight: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appIconContainer: {
    marginRight: 12,
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    // textAlign: 'center',
    flex: 1,
    flexShrink: 1,
  },
});

export default TopHeader;
