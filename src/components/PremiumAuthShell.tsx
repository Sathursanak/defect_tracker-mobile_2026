import React from 'react';
import { View, StyleSheet, StatusBar, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { premiumGradients, premiumOrbs } from '../theme/premiumTheme';

interface PremiumAuthShellProps {
  children: React.ReactNode;
  contentStyle?: ViewStyle;
}

const PremiumAuthShell: React.FC<PremiumAuthShellProps> = ({ children, contentStyle }) => (
  <LinearGradient
    colors={premiumGradients.screen}
    style={styles.root}
    start={{ x: 0.2, y: 0 }}
    end={{ x: 0.8, y: 1 }}
  >
    <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
    <View style={[styles.orb, styles.orbTop, { backgroundColor: premiumOrbs.top }]} />
    <View style={[styles.orb, styles.orbRight, { backgroundColor: premiumOrbs.right }]} />
    <View style={[styles.orb, styles.orbBottom, { backgroundColor: premiumOrbs.bottom }]} />
    <View style={[styles.content, contentStyle]}>{children}</View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orbTop: {
    width: 220,
    height: 220,
    top: -60,
    right: -40,
  },
  orbRight: {
    width: 160,
    height: 160,
    top: '38%',
    left: -50,
  },
  orbBottom: {
    width: 280,
    height: 280,
    bottom: -100,
    left: '20%',
  },
  content: {
    flex: 1,
  },
});

export default PremiumAuthShell;
