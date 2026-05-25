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
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LogoutButton from './LogoutButton';
import {
  premiumColors,
  premiumGradients,
  premiumNav,
  premiumShadows,
  premiumShadowsNav,
  premiumRadius,
} from '../theme/premiumTheme';

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

/** Content block: padding + minHeight + accent bar */
const HEADER_BODY_HEIGHT = 10 + 56 + 10 + 3;

export function useTopHeaderHeight(extraSpacing = 12): number {
  const insets = useSafeAreaInsets();
  const topPad =
    Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight ?? 24;
  return topPad + HEADER_BODY_HEIGHT + extraSpacing;
}

const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  style,
  backgroundColor = premiumNav.headerBg,
  titleColor = premiumColors.textPrimary,
  iconColor = premiumColors.primary,
  onBackPress,
  showLogout,
  rightActionIcon,
  rightActionColor = premiumColors.primary,
  onRightActionPress,
}) => {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight ?? 0;

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={backgroundColor}
        translucent={Platform.OS === 'android'}
      />
      <View
        style={[
          styles.container,
          premiumShadowsNav.header,
          { backgroundColor, paddingTop: topPad },
          style,
        ]}
      >
        <View style={styles.content}>
          {onBackPress ? (
            <TouchableOpacity
              onPress={onBackPress}
              style={styles.backButton}
              activeOpacity={0.75}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="chevron-back" size={22} color={iconColor} />
            </TouchableOpacity>
          ) : (
            <View style={styles.sideSpacer} />
          )}

          <View style={styles.centerSection}>
            <LinearGradient
              colors={premiumGradients.logoRing}
              style={styles.appIconRing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.appIconInner}>
                <Ionicons name="bug" size={20} color="#fff" />
              </View>
            </LinearGradient>
            {title ? (
              <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
                {title}
              </Text>
            ) : null}
          </View>

          <View style={styles.rightSlot}>
            {showLogout ? (
              <View style={styles.actionPill}>
                <LogoutButton iconColor={rightActionColor} iconSize={22} />
              </View>
            ) : rightActionIcon && onRightActionPress ? (
              <TouchableOpacity
                style={styles.actionPill}
                onPress={onRightActionPress}
                activeOpacity={0.75}
              >
                <Ionicons
                  name={rightActionIcon}
                  size={22}
                  color={rightActionColor}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.sideSpacer} />
            )}
          </View>
        </View>

        <LinearGradient
          colors={premiumNav.headerAccent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accentBar}
        />
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: premiumNav.headerBorder,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: premiumColors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideSpacer: {
    width: 40,
    height: 40,
  },
  centerSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    minWidth: 0,
  },
  appIconRing: {
    width: 40,
    height: 40,
    borderRadius: premiumRadius.headerIcon,
    padding: 2,
    marginRight: 10,
    ...premiumShadows.logo,
  },
  appIconInner: {
    flex: 1,
    borderRadius: premiumRadius.headerIcon - 2,
    backgroundColor: premiumColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  rightSlot: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  actionPill: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: premiumColors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentBar: {
    height: 3,
    width: '100%',
  },
});

export default TopHeader;
