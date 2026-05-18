import React from 'react';
import { View, StyleSheet } from 'react-native';

interface RoundIconProps {
  size?: number;
  backgroundColor?: string;
  children: React.ReactNode;
  style?: object;
}

const RoundIcon: React.FC<RoundIconProps> = ({
  size = 96,
  backgroundColor = '#60A5FA',
  children,
  style = {},
}) => (
  <View
    style={[
      styles.circle,
      { width: size, height: size, borderRadius: size / 2, backgroundColor },
      style,
    ]}
  >
    {children}
  </View>
);

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RoundIcon;
