import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import StatusCard from '../components/StatusCard';
import ProjectCard from '../components/ProjectCard';
import TopHeader, { useTopHeaderHeight } from '../components/TopHeader';
import Footer from '../components/Footer';
import * as api from '../services/api';
import { premiumColors, premiumShadows } from '../theme/premiumTheme';

type RiskLevel = 'high' | 'medium' | 'low';

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

const FILTERS = [
  { key: 'all', label: 'All', color: premiumColors.primary },
  { key: 'high', label: 'High', color: RISK_COLORS.high },
  { key: 'medium', label: 'Medium', color: RISK_COLORS.medium },
  { key: 'low', label: 'Low', color: RISK_COLORS.low },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 10;
const PROJECT_CARD_SIZE = Math.max((SCREEN_WIDTH - 4 * CARD_MARGIN) / 2, 140);
const GRID_GAP = 10;
const PROJECTS_ROW_WIDTH = PROJECT_CARD_SIZE * 2 + GRID_GAP;

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

const SectionHeader = ({
  icon,
  title,
  badge,
}: {
  icon: string;
  title: string;
  badge?: string;
}) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionHeaderLeft}>
      <View style={styles.sectionIconWrap}>
        <Ionicons name={icon as any} size={18} color={premiumColors.primary} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {badge ? (
      <View style={styles.sectionBadge}>
        <Text style={styles.sectionBadgeText}>{badge}</Text>
      </View>
    ) : null}
  </View>
);

const Dashboard = () => {
  const headerOffset = useTopHeaderHeight();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [projects, setProjects] = useState<{ name: string; risk: RiskLevel }[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectCounts, setProjectCounts] = useState({ high: 0, medium: 0, low: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const projectNames = await api.getProjects();
        const detailsPromises = projectNames.map(name => api.getProjectDetails(name));
        const details = await Promise.all(detailsPromises);

        const loadedProjects = details
          .filter(Boolean)
          .map(d => ({
            name: d!.name,
            risk: d!.risk as RiskLevel,
          }));

        setProjects(loadedProjects);

        const metrics = await api.getDashboardMetrics();
        setProjectCounts({
          high: metrics.highRiskCount,
          medium: metrics.mediumRiskCount,
          low: metrics.lowRiskCount,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statusCards = [
    {
      key: 'high',
      label: 'High Risk',
      count: projectCounts.high,
      desc: 'Needs attention',
      color: RISK_COLORS.high,
      icon: <Ionicons name="alert-circle-outline" size={36} color={RISK_COLORS.high} />,
    },
    {
      key: 'medium',
      label: 'Medium Risk',
      count: projectCounts.medium,
      desc: 'Monitor closely',
      color: RISK_COLORS.medium,
      icon: <Ionicons name="time-outline" size={36} color={RISK_COLORS.medium} />,
    },
    {
      key: 'low',
      label: 'Low Risk',
      count: projectCounts.low,
      desc: 'On track',
      color: RISK_COLORS.low,
      icon: <Ionicons name="checkmark-circle-outline" size={36} color={RISK_COLORS.low} />,
    },
  ];

  const filteredProjects =
    selectedFilter === 'all'
      ? [...projects].sort((a, b) => {
          const riskOrder = { high: 0, medium: 1, low: 2 };
          return riskOrder[a.risk] - riskOrder[b.risk];
        })
      : projects.filter(p => p.risk === selectedFilter);

  const totalProjects = projects.length;

  return (
    <View style={styles.screen}>
      <TopHeader title="Dashboard Overview" showLogout={true} />
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={premiumColors.primary} />
          <Text style={styles.loadingText}>Loading Dashboard...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.scrollContent, { paddingTop: headerOffset }]}
          showsVerticalScrollIndicator={false}
        >
          {/* —— Section 1: Risk overview —— */}
          <View style={[styles.sectionCard, premiumShadows.card]}>
            <SectionHeader icon="pie-chart-outline" title="Risk Overview" />
            <View style={styles.metricsInner}>
              <View style={styles.statusCardsRow}>
                {statusCards.map((card, index) => (
                  <StatusCard
                    key={card.key}
                    icon={card.icon}
                    label={card.label}
                    count={card.count}
                    desc={card.desc}
                    color={card.color}
                    showDivider={index < statusCards.length - 1}
                  />
                ))}
              </View>
            </View>
          </View>

          {/* —— Section 2: Filters + projects —— */}
          <View style={[styles.sectionCard, styles.projectsSection, premiumShadows.card]}>
            <SectionHeader
              icon="grid-outline"
              title="Projects"
              badge={`${filteredProjects.length}${selectedFilter !== 'all' ? ` / ${totalProjects}` : ''}`}
            />

            <View style={styles.filtersBox}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersRow}
              >
                {FILTERS.map(filter => {
                  const isActive = selectedFilter === filter.key;
                  return (
                    <TouchableOpacity
                      key={filter.key}
                      style={[
                        styles.filterChip,
                        isActive && [
                          styles.filterChipActive,
                          { backgroundColor: filter.color, borderColor: filter.color },
                        ],
                      ]}
                      onPress={() => setSelectedFilter(filter.key)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          isActive && styles.filterChipTextActive,
                          !isActive && { color: filter.color },
                        ]}
                      >
                        {filter.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {filteredProjects.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="folder-open-outline"
                  size={40}
                  color={premiumColors.primaryLight}
                />
                <Text style={styles.noProjectsText}>
                  No projects match this filter
                </Text>
              </View>
            ) : (
              <View style={[styles.projectsRow, { width: PROJECTS_ROW_WIDTH }]}>
                {filteredProjects.map((project, idx) => (
                  <View key={project.name + idx} style={styles.projectCell}>
                    <ProjectCard
                      name={project.name}
                      risk={project.risk}
                      riskColor={RISK_COLORS[project.risk] || premiumColors.primary}
                      riskLabel={RISK_LABELS[project.risk]}
                      icon={getProjectIcon(project.risk)}
                      size={PROJECT_CARD_SIZE}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      )}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#E8EEF8',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 4,
    paddingBottom: 110,
    gap: 16,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8EEF8',
  },
  loadingText: {
    marginTop: 12,
    color: premiumColors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: premiumColors.surface,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(191, 219, 254, 0.5)',
    overflow: 'hidden',
  },
  projectsSection: {
    paddingHorizontal: 6,
    overflow: 'visible',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFF6FF',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: premiumColors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: premiumColors.textPrimary,
    letterSpacing: -0.2,
  },
  sectionBadge: {
    backgroundColor: premiumColors.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: premiumColors.inputBorder,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: premiumColors.primary,
  },
  metricsInner: {
    backgroundColor: '#F8FAFF',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  statusCardsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  filtersBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    borderWidth: 1.5,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: premiumColors.textSecondary,
  },
  filterChipTextActive: {
    color: '#fff',
  },
  projectsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    marginTop: 4,
    columnGap: GRID_GAP,
    rowGap: 4,
  },
  projectCell: {
    width: PROJECT_CARD_SIZE,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 28,
    gap: 10,
    width: '100%',
  },
  noProjectsText: {
    fontSize: 15,
    color: premiumColors.textSecondary,
    fontWeight: '500',
  },
});

export default Dashboard;
