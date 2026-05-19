import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import StatusCard from '../components/StatusCard';
import ProjectCard from '../components/ProjectCard';
import TopHeader from '../components/TopHeader';
import Footer from '../components/Footer';
import { mockProjects } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const PROJECTS: { name: string; risk: RiskLevel }[] = mockProjects.map(
  project => ({
    name: project.name,
    risk: project.risk,
  }),
);

const RISK_COLORS = {
  high: '#c62828',
  medium: '#f9a825',
  low: '#2ecc40',
};

const RISK_LABELS = {
  high: 'High Risk',
  medium: 'Medium Risk',
  low: 'Low Risk',
};

// Define RiskLevel type
type RiskLevel = 'high' | 'medium' | 'low';

const FILTERS = [
  { key: 'all', label: 'All Projects' },
  { key: 'high', label: 'High Risk' },
  { key: 'medium', label: 'Medium Risk' },
  { key: 'low', label: 'Low Risk' },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 10;
const PROJECT_CARD_SIZE = Math.max((SCREEN_WIDTH - 4 * CARD_MARGIN) / 2, 140);

const getProjectIcon = (risk: RiskLevel) => {
  switch (risk) {
    case 'high':
      return <Ionicons name="warning" size={48} color="#fff" />;
    case 'medium':
      return <Ionicons name="time" size={48} color="#fff" />;
    case 'low':
      return <Ionicons name="checkmark-circle" size={48} color="#fff" />;
    default:
      return <Ionicons name="folder" size={48} color="#fff" />;
  }
};

const Dashboard = () => {
  const navigation = useNavigation();
  const { logout } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('all');

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

  // Calculate dynamic counts for each risk level
  const projectCounts = {
    high: PROJECTS.filter(p => p.risk === 'high').length,
    medium: PROJECTS.filter(p => p.risk === 'medium').length,
    low: PROJECTS.filter(p => p.risk === 'low').length,
  };

  // Create status cards with dynamic counts
 const statusCards = [
  {
    key: 'high',
    label: 'High Risk Projects',
    count: projectCounts.high,
    desc: 'Needs attention',
    color: '#c62828',
    icon: (
      <Ionicons
        name="alert-circle-outline"
        size={36}
        color="#c62828"
      />
    ),
  },
  {
    key: 'medium',
    label: 'Medium Risk Projects',
    count: projectCounts.medium,
    desc: 'Monitor closely',
    color: '#f9a825',
    icon: (
      <Ionicons
        name="time-outline"
        size={36}
        color="#f9a825"
      />
    ),
  },
  {
    key: 'low',
    label: 'Low Risk Projects',
    count: projectCounts.low,
    desc: 'On track',
    color: '#2ecc40',
    icon: (
      <Ionicons
        name="checkmark-circle-outline"
        size={36}
        color="#2ecc40"
      />
    ),
  },
];

  const filteredProjects =
    selectedFilter === 'all'
      ? PROJECTS.sort((a, b) => {
        const riskOrder = { high: 0, medium: 1, low: 2 };
        return riskOrder[a.risk] - riskOrder[b.risk];
      })
      : PROJECTS.filter(p => p.risk === selectedFilter);

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <TopHeader
        title="Dashboard Overview"
        rightActionIcon="log-out-outline"
        rightActionColor="#3b82f6"
        onRightActionPress={handleLogout}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
      >

        <View style={styles.statusCardsRow}>
          {statusCards.map(card => (
            <StatusCard
              key={card.key}
              icon={card.icon}
              label={card.label}
              count={card.count}
              desc={card.desc}
              color={card.color}
            />
          ))}
        </View>

        <View style={styles.projectsSection}>
          <View style={styles.filtersRow}>
            {FILTERS.map(filter => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.key && [
                    styles.filterButtonActive,
                    filter.key === 'high' && { borderColor: '#c62828' },
                    filter.key === 'medium' && { borderColor: '#f9a825' },
                    filter.key === 'low' && { borderColor: '#2ecc40' },
                  ],
                ]}
                onPress={() => setSelectedFilter(filter.key)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedFilter === filter.key &&
                    styles.filterButtonTextActive,
                    filter.key === 'high' && { color: '#c62828' },
                    filter.key === 'medium' && { color: '#f9a825' },
                    filter.key === 'low' && { color: '#2ecc40' },
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.projectsRow}>
            {filteredProjects.length === 0 ? (
              <Text style={styles.noProjectsText}>
                No projects found for this filter.
              </Text>
            ) : (
              filteredProjects.map((project, idx) => (
                <ProjectCard
                  key={project.name + idx}
                  name={project.name}
                  risk={project.risk}
                  riskColor={RISK_COLORS[project.risk] || '#3b82f6'}
                  riskLabel={RISK_LABELS[project.risk]}
                  icon={getProjectIcon(project.risk)}
                  size={PROJECT_CARD_SIZE}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100, // Add padding to prevent content from being hidden behind footer
    paddingTop: 80, // Add padding to prevent content from being hidden behind fixed header
  },
  backButtonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  dashboardHeader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 2,
  },
  statusCardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 18,
    marginTop: 8,
  },
  statusCard: {
    flex: 1,
    minWidth: 110,
    maxWidth: 140,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 6,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 8,
  },
  statusCardLabel: {
    fontSize: 15,
    color: '#3b82f6',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  statusCardCount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 2,
    marginBottom: 2,
    textAlign: 'center',
  },
  statusCardDesc: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  projectsSection: {
    marginTop: 8,
    paddingHorizontal: 12,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 12,
    marginLeft: 4,
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 18,
    marginLeft: 1,
    flexWrap: 'nowrap',
  },
  filterButton: {
    backgroundColor: '#e4e6ebff',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 4,
    margin: 4,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: '#e6eeff',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  filterButtonTextActive: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  actionsRow: {
    marginHorizontal: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  defectsButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  defectsButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  projectsRowScroll: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  projectsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  projectCardWrapper: {
    alignItems: 'center',
    marginRight: CARD_MARGIN,
    marginBottom: CARD_MARGIN,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  projectCircleShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  riskLabelWrapper: {
    marginTop: 2,
    alignItems: 'center',
  },
  riskLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 2,
  },
  noProjectsText: {
    fontSize: 16,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 24,
    marginLeft: 8,
  },
  projectSelectorContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
});

export default Dashboard;
