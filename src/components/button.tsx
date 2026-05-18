import React, { ReactNode } from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
  title?: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  children?: ReactNode;
  [key: string]: any;
}

const Button: React.FC<ButtonProps> = ({ onPress, title, style, textStyle, children, ...props }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={onPress} {...props}>
    {title ? <Text style={[styles.text, textStyle]}>{title}</Text> : children}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Button;