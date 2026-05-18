import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton';
import RoundIcon from '../components/RoundIcon';
import Ionicons from 'react-native-vector-icons/Ionicons';

const LoginPage = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.glowCircleTop} />
      <View style={styles.glowCircleBottom} />
      <View style={styles.overlay}>
        <BackButton
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          iconColor="#FFFFFF"
          textStyle={{ color: '#FFFFFF' }}
        />
        <View style={styles.card}>
          <View style={styles.centeredIconWrapper}>
            <RoundIcon size={72} backgroundColor="#60A5FA">
              <Ionicons name="bug-outline" size={40} color="#fff" />
            </RoundIcon>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to your DefectTracker account
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <Ionicons name="person-outline" size={18} /> Username
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor="#6b7280"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <Ionicons name="lock-closed-outline" size={18} /> Password
            </Text>
            <View style={styles.inputIconWrapper}>
              <TextInput
                style={[styles.input, styles.inputWithIcon]}
                placeholder="Enter your password"
                placeholderTextColor="#6b7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIconTouchable}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rowBetween}>
            <View style={styles.rowAlignCenter}>
              <TouchableOpacity
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                {rememberMe && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </TouchableOpacity>
              <Text style={styles.rememberMe}>Remember me</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                (navigation as any).dispatch({
                  ...Object.assign({
                    type: 'NAVIGATE',
                    payload: { name: 'ForgotPassword' },
                  }),
                })
              }
            >
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => {
              if (username === 'admin' && password === 'admin') {
                (navigation as any).navigate('Dashboard');
              } else {
                // Optionally show an error or do nothing
              }
            }}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  glowCircleTop: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#60A5FA',
    opacity: 0.15,
    transform: [{ scale: 1.5 }],
  },
  glowCircleBottom: {
    position: 'absolute',
    bottom: 50,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#60A5FA',
    opacity: 0.1,
    transform: [{ scale: 1.5 }],
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 24,
    zIndex: 2,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 32,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    fontSize: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    color: '#22223b',
    marginBottom: 0,
  },
  inputWithIcon: {
    paddingRight: 40,
  },
  eyeIconTouchable: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    height: '100%',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#60A5FA',
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#60A5FA',
    borderColor: '#60A5FA',
  },
  rememberMe: {
    color: '#334155',
    fontSize: 15,
  },
  forgotPassword: {
    color: '#60A5FA',
    fontWeight: '700',
    fontSize: 15,
  },
  signInButton: {
    backgroundColor: '#60A5FA',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  signInButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  inputIconWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centeredIconWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default LoginPage;
