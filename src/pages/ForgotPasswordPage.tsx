import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton';
import RoundIcon from '../components/RoundIcon';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ForgotPasswordPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <ImageBackground
      source={require('../assets/images/background.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
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
              <Ionicons name="mail-outline" size={40} color="#fff" />
            </RoundIcon>
          </View>
          <Text style={styles.title}>Reset Password</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <Ionicons name="mail-outline" size={18} /> Email Address
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              placeholderTextColor="#6b7280"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <Ionicons name="lock-closed-outline" size={18} /> New Password
            </Text>
            <View style={styles.inputIconWrapper}>
              <TextInput
                style={[styles.input, styles.inputWithIcon]}
                placeholder="Enter new password"
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

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <Ionicons name="lock-closed-outline" size={18} /> Confirm Password
            </Text>
            <View style={styles.inputIconWrapper}>
              <TextInput
                style={[styles.input, styles.inputWithIcon]}
                placeholder="Confirm new password"
                placeholderTextColor="#6b7280"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIconTouchable}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.sendButton}>
            <View style={styles.sendButtonContent}>
              <Ionicons
                name="refresh-outline"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sendButtonText}>Reset</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.signInLinkWrapper}>
            Remember your password?{' '}
            <Text style={styles.signInLink} onPress={() => navigation.goBack()}>
              Sign in here
            </Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  centeredIconWrapper: {
    alignItems: 'center',
    marginBottom: 16,
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
  sendButton: {
    backgroundColor: '#60A5FA',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  sendButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWithIcon: {
    paddingRight: 40,
  },
  inputIconWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  eyeIconTouchable: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    height: '100%',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  infoBox: {
    backgroundColor: '#f3f6fa',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    marginTop: 8,
  },
  infoTitle: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 15,
  },
  infoDesc: {
    color: '#6b7280',
    fontWeight: 'normal',
    fontSize: 14,
  },
  signInLinkWrapper: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 15,
    marginTop: 8,
  },
  signInLink: {
    color: '#60A5FA',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default ForgotPasswordPage;
