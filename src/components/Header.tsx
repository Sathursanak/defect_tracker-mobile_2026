import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import BackButton from './BackButton';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, style, children }) => {
  return (
    <View style={[styles.headerWrapper, style]}>
      {onBack && <BackButton onPress={onBack} style={styles.backButton} />}
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    paddingTop: 48,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 28,
    left: 0,
    zIndex: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default Header;
