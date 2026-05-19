import React from 'react';
import { TouchableOpacity, Alert, StyleSheet, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

interface LogoutButtonProps {
  style?: ViewStyle;
  iconColor?: string;
  iconSize?: number;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  style,
  iconColor = '#3b82f6',
  iconSize = 24,
}) => {
  const navigation = useNavigation();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            (navigation as any).reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handleLogout}
      activeOpacity={0.7}
    >
      <Ionicons name="log-out-outline" size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
  },
});

export default LogoutButton;
