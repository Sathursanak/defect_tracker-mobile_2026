import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const Bug = () => <Ionicons name="bug" size={48} color="#60A5FA" />;
const ArrowRight = () => (
  <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
);
const CheckIcon = () => (
  <Ionicons name="checkmark-circle" size={20} color="#60A5FA" />
);

type RootStackParamList = {
  Login: undefined;
};

const Welcome = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const fullSubtitle = 'Professional Defect Management';

  useEffect(() => {
    // Elegant entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Typewriter effect for subtitle
    const subtitleTimer = setTimeout(() => {
      let currentIndex = 0;
      const letterInterval = setInterval(() => {
        if (currentIndex <= fullSubtitle.length) {
          setDisplayedSubtitle(fullSubtitle.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(letterInterval);
        }
      }, 40);

      return () => clearInterval(letterInterval);
    }, 600);

    return () => {
      clearTimeout(subtitleTimer);
    };
  }, [fadeAnim, slideAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {/* Decorative ambient glow elements */}
      <View style={styles.glowCircleTop} />
      <View style={styles.glowCircleBottom} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top Section - Logo & Title */}
        <Animated.View
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.logoWrapper}>
            <View style={styles.logoInner}>
              <Bug />
            </View>
          </View>
          
          <Text style={styles.title}>Defect Tracker</Text>
          <Text style={styles.subtitle}>
            {displayedSubtitle}
          </Text>
        </Animated.View>

        {/* Bottom Section - Action Card */}
        <Animated.View
          style={[
            styles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.glassCard}>
            <Text style={styles.cardTitle}>Master Your Workflow</Text>
            <Text style={styles.cardDescription}>
              Experience seamless bug tracking and agile project management all in one premium platform.
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Login')}
              style={styles.buttonShadow}
            >
              <LinearGradient
                colors={['#60A5FA', '#60A5FA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaButton}
              >
                <Text style={styles.ctaButtonText}>Get Started</Text>
                <ArrowRight />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
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
    opacity: 0.15,
    transform: [{ scale: 1.5 }],
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: height * 0.15,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 10 },
    // shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoInner: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
    height: 24, // Keep height stable for typewriter
  },
  cursor: {
    color: '#60A5FA',
    fontWeight: 'bold',
  },
  cardContainer: {
    width: '100%',
    marginBottom: 60,
  },
  glassCard: {
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
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 24,
    marginBottom: 24,
  },
  featuresList: {
    marginBottom: 32,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  buttonShadow: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 12,
    opacity: 0.9,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
});

export default Welcome;
