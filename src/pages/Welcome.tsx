import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import PremiumAuthShell from '../components/PremiumAuthShell';
import {
  premiumColors,
  premiumGradients,
  premiumShadows,
  premiumRadius,
} from '../theme/premiumTheme';

const { height } = Dimensions.get('window');

type RootStackParamList = {
  Login: undefined;
};

const Welcome = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const fullSubtitle = 'Professional Defect Management';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 22,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ]),
    ).start();

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
    }, 500);

    return () => clearTimeout(subtitleTimer);
  }, [fadeAnim, slideAnim, floatAnim]);

  const cardLift = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -6],
  });

  return (
    <PremiumAuthShell>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={premiumGradients.logoRing}
            style={[styles.logoRing, premiumShadows.logo]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.logoInner}>
              <Ionicons name="bug" size={44} color={premiumColors.accent} />
            </View>
          </LinearGradient>

          <Text style={styles.title}>Defect Tracker</Text>
          <Text style={styles.subtitle}>{displayedSubtitle}</Text>
          <View style={styles.titleUnderline} />
        </Animated.View>

        <Animated.View
          style={[
            styles.cardContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { translateY: cardLift }],
            },
          ]}
        >
          <View style={[styles.premiumCard, premiumShadows.card]}>
            <View style={styles.cardAccent} />
            <Text style={styles.cardTitle}>Master Your Workflow</Text>
            <Text style={styles.cardDescription}>
              Seamless bug tracking and agile project management in one refined
              mobile experience.
            </Text>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => navigation.navigate('Login')}
              style={[styles.buttonWrap, premiumShadows.button]}
            >
              <LinearGradient
                colors={premiumGradients.primaryButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaButton}
              >
                <Text style={styles.ctaButtonText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={22} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </PremiumAuthShell>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: height * 0.12,
    paddingBottom: 48,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoRing: {
    width: 108,
    height: 108,
    borderRadius: premiumRadius.logo,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  logoInner: {
    width: '100%',
    height: '100%',
    borderRadius: premiumRadius.logo - 3,
    backgroundColor: premiumColors.logoInnerBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: premiumColors.logoInnerBorder,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: premiumColors.textOnDark,
    letterSpacing: -0.8,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: premiumColors.textMutedOnDark,
    fontWeight: '500',
    height: 22,
    letterSpacing: 0.3,
  },
  titleUnderline: {
    width: 48,
    height: 3,
    borderRadius: 2,
    backgroundColor: premiumColors.primaryLight,
    marginTop: 14,
    opacity: 0.9,
  },
  cardContainer: {
    width: '100%',
  },
  premiumCard: {
    backgroundColor: premiumColors.surfaceGlass,
    borderRadius: premiumRadius.card,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: premiumColors.primary,
    borderTopLeftRadius: premiumRadius.card,
    borderTopRightRadius: premiumRadius.card,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: premiumColors.textPrimary,
    marginBottom: 10,
    marginTop: 4,
    letterSpacing: -0.3,
  },
  cardDescription: {
    fontSize: 15,
    color: premiumColors.textSecondary,
    lineHeight: 23,
    marginBottom: 26,
  },
  buttonWrap: {
    borderRadius: premiumRadius.button,
    overflow: 'hidden',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    borderRadius: premiumRadius.button,
    gap: 10,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});

export default Welcome;
