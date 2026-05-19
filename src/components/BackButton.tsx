import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface BackButtonProps {
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconColor?: string;
  text?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  style = {},
  textStyle = {},
  iconColor = '#3b82f6',
  text = 'Back',
}) => (
  <TouchableOpacity style={[styles.backButton, style]} onPress={onPress}>
    <Ionicons name="arrow-back-outline" size={28} color={iconColor} />
    <Text style={[styles.backText, textStyle]}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#3b82f6',
    fontSize: 18,
    marginLeft: 4,
    fontWeight: 'bold',
  },
});

export default BackButton;
