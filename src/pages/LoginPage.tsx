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
import { useAuth, UserProfile } from '../context/AuthContext';
import {
  premiumColors,
  premiumGradients,
  premiumShadows,
  premiumRadius,
} from '../theme/premiumTheme';

const mockUsers: UserProfile[] = [
  {
    username: 'admin',
    password: 'admin',
    fullName: 'Admin User',
    role: 'Administrator',
    email: 'admin@defecttracker.com',
    department: 'Operations',
    joinDate: 'January 2022',
    projectsAssigned: 8,
    defectsReported: 213,
    defectsResolved: 197,
  },
  {
    username: 'qa',
    password: 'qa123',
    fullName: 'QA Specialist',
    role: 'Quality Analyst',
    email: 'qa@defecttracker.com',
    department: 'Quality Assurance',
    joinDate: 'March 2023',
    projectsAssigned: 5,
    defectsReported: 152,
    defectsResolved: 140,
  },
  {
    username: 'dev',
    password: 'dev123',
    fullName: 'Developer',
    role: 'Engineer',
    email: 'dev@defecttracker.com',
    department: 'Engineering',
    joinDate: 'July 2023',
    projectsAssigned: 6,
    defectsReported: 88,
    defectsResolved: 79,
  },
];

const LoginPage = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSignIn = () => {
    const user = mockUsers.find(
      item => item.username.toLowerCase() === username.trim().toLowerCase(),
    );

    if (!user) {
      setLoginError('User not found. Please check your username.');
      return;
    }

    if (user.password !== password) {
      setLoginError('Incorrect password. Please try again.');
      return;
    }

    setLoginError('');
    login(user);
    (navigation as { navigate: (screen: string) => void }).navigate('Dashboard');
  };

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
                <Ionicons name="shield-checkmark" size={36} color={premiumColors.accent} />
              </View>
            </LinearGradient>

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <View style={styles.inputShell}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={premiumColors.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor="#94A3B8"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputShell}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={premiumColors.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={premiumColors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.rowBetween}>
              <TouchableOpacity
                style={styles.rowAlignCenter}
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Ionicons name="checkmark" size={14} color="#fff" />}
                </View>
                <Text style={styles.rememberMe}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  (navigation as { navigate: (screen: string) => void }).navigate(
                    'ForgotPassword',
                  )
                }
              >
                <Text style={styles.forgotPassword}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleSignIn}
              style={[styles.signInWrap, premiumShadows.button]}
            >
              <LinearGradient
                colors={premiumGradients.primaryButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.signInButton}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>
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
    fontSize: 15,
    color: premiumColors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 6,
  },
  inputGroup: {
    marginBottom: 16,
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
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 4,
  },
  rowAlignCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: premiumColors.primaryLight,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: premiumColors.primary,
    borderColor: premiumColors.primary,
  },
  rememberMe: {
    color: premiumColors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  forgotPassword: {
    color: premiumColors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  errorText: {
    color: premiumColors.error,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  signInWrap: {
    borderRadius: premiumRadius.button,
    overflow: 'hidden',
    marginTop: 4,
  },
  signInButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: premiumRadius.button,
  },
  signInButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.4,
  },
});

export default LoginPage;
