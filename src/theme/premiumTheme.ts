/** Premium auth / onboarding palette — deep ocean blue */
export const premiumColors = {
  primary: '#2563EB',
  primaryLight: '#60A5FA',
  primaryDark: '#1D4ED8',
  accent: '#93C5FD',
  glow: '#3B82F6',

  bgTop: '#030B18',
  bgMid: '#0A1628',
  bgBottom: '#0F2847',

  surface: '#FFFFFF',
  surfaceGlass: 'rgba(255, 255, 255, 0.97)',
  surfaceMuted: '#EFF6FF',

  textOnDark: '#F8FAFC',
  textMutedOnDark: '#93C5FD',
  textPrimary: '#0A1628',
  textSecondary: '#64748B',
  textLabel: '#1E40AF',

  inputBg: '#F8FAFC',
  inputBorder: '#BFDBFE',
  inputBorderFocus: '#60A5FA',

  logoInnerBg: 'rgba(6, 18, 42, 0.92)',
  logoInnerBorder: 'rgba(96, 165, 250, 0.3)',

  error: '#EF4444',
  success: '#10B981',
};

export const premiumGradients = {
  screen: [premiumColors.bgTop, premiumColors.bgMid, premiumColors.bgBottom],
  primaryButton: ['#1D4ED8', '#2563EB', '#3B82F6'],
  primaryButtonPressed: ['#1E40AF', '#1D4ED8', '#2563EB'],
  logoRing: ['#60A5FA', '#2563EB', '#1D4ED8'],
};

export const premiumOrbs = {
  top: 'rgba(96, 165, 250, 0.24)',
  right: 'rgba(59, 130, 246, 0.18)',
  bottom: 'rgba(37, 99, 235, 0.14)',
};

export const premiumShadows = {
  card: {
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 20,
  },
  button: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 14,
  },
  logo: {
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.55,
    shadowRadius: 28,
    elevation: 18,
  },
};

export const premiumRadius = {
  card: 28,
  button: 18,
  input: 14,
  logo: 28,
  headerIcon: 14,
  footer: 24,
  tab: 14,
};

export const premiumNav = {
  headerBg: premiumColors.surface,
  headerBorder: 'rgba(37, 99, 235, 0.12)',
  headerAccent: ['#60A5FA', '#2563EB', '#1D4ED8'],
  footerGradient: ['#1E40AF', '#2563EB', '#3B82F6'],
  tabActiveBg: '#FFFFFF',
  tabActiveIcon: premiumColors.primary,
  tabInactiveIcon: 'rgba(255, 255, 255, 0.85)',
  tabInactiveLabel: 'rgba(255, 255, 255, 0.75)',
};

export const premiumShadowsNav = {
  header: {
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
  },
  footer: {
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 16,
  },
};
