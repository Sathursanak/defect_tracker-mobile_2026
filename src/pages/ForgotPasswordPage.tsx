import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BackButton from '../components/BackButton';
import PremiumAuthShell from '../components/PremiumAuthShell';
import {
  premiumColors,
  premiumGradients,
  premiumShadows,
  premiumRadius,
} from '../theme/premiumTheme';

const ForgotPasswordPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <PremiumAuthShell>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <BackButton
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          iconColor={premiumColors.textOnDark}
          textStyle={{ color: premiumColors.textOnDark }}
        />

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, premiumShadows.card]}>
            <LinearGradient
              colors={premiumGradients.logoRing}
              style={styles.iconRing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.iconInner}>
                <Ionicons name="key" size={34} color={premiumColors.accent} />
              </View>
            </LinearGradient>

            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email and choose a new secure password
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputShell}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={premiumColors.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="you@company.com"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.inputShell}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={premiumColors.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  placeholder="Enter new password"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={premiumColors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputShell}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={premiumColors.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  placeholder="Confirm new password"
                  placeholderTextColor="#94A3B8"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={premiumColors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.88}
              style={[styles.resetWrap, premiumShadows.button]}
            >
              <LinearGradient
                colors={premiumGradients.primaryButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.resetButton}
              >
                <Ionicons name="refresh" size={20} color="#fff" style={styles.resetIcon} />
                <Text style={styles.resetButtonText}>Reset Password</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.signInLinkWrapper}>
              Remember your password?{' '}
              <Text style={styles.signInLink} onPress={() => navigation.goBack()}>
                Sign in
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PremiumAuthShell>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 20,
    zIndex: 2,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 48,
    paddingTop: 100,
  },
  card: {
    backgroundColor: premiumColors.surfaceGlass,
    borderRadius: premiumRadius.card,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  iconRing: {
    width: 76,
    height: 76,
    borderRadius: 22,
    padding: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  iconInner: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: premiumColors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: premiumColors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: premiumColors.textSecondary,
    textAlign: 'center',
    marginBottom: 22,
    marginTop: 6,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontWeight: '600',
    color: premiumColors.textLabel,
    marginBottom: 8,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: premiumColors.inputBg,
    borderRadius: premiumRadius.input,
    borderWidth: 1.5,
    borderColor: premiumColors.inputBorder,
    paddingHorizontal: 12,
    minHeight: 52,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: premiumColors.textPrimary,
    paddingVertical: 12,
  },
  inputWithIcon: {
    paddingRight: 36,
  },
  eyeBtn: {
    padding: 4,
  },
  resetWrap: {
    borderRadius: premiumRadius.button,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 18,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: premiumRadius.button,
  },
  resetIcon: {
    marginRight: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.3,
  },
  signInLinkWrapper: {
    textAlign: 'center',
    color: premiumColors.textSecondary,
    fontSize: 14,
  },
  signInLink: {
    color: premiumColors.primary,
    fontWeight: '700',
  },
});

export default ForgotPasswordPage;
