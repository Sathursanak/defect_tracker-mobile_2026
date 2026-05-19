import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Animated } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TopHeader from '../components/TopHeader';
import Footer from '../components/Footer';
import ProjectSelector from '../components/ProjectSelector';
import SeverityBreakdown from '../components/SeverityBreakdown';
import DefectIndicators from './DefectIndicators';
import { mockProjects, getProjectData } from '../data/mockData';


const ProjectDetails = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Record<string, object | undefined>, string>>();

  const initialProject =
    (route.params as { projectName?: string } | undefined)?.projectName ||
    mockProjects[0].name;
  const scrollViewRef = useRef<ScrollView>(null);
  const projectSelectorRef = useRef<ScrollView>(null);
  
  const animY = useRef(new Animated.Value(-4)).current;
  const [showScrollDownButton, setShowScrollDownButton] = useState(true);

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(animY, {
          toValue: 4,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animY, {
          toValue: -4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [animY]);

  const handleScroll = (event: any) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset > 60) {
      setShowScrollDownButton(false);
    } else {
      setShowScrollDownButton(true);
    }
  };

  const [selectedProject, setSelectedProject] = useState(initialProject);

  const allProjects = mockProjects.map(project => project.name);

  const getOrderedProjects = () => {
    const ordered = [...allProjects];
    const selectedIndex = ordered.indexOf(selectedProject);
    if (selectedIndex > 0) {
      const [selected] = ordered.splice(selectedIndex, 1);
      ordered.unshift(selected);
    }
    return ordered;
  };

  const getCurrentProjectRisk = () => {
    const projectData = getProjectData(selectedProject);
    return projectData ? projectData.risk : 'low';
  };

  const currentRisk = getCurrentProjectRisk();

  const handleProjectSelect = (project: string) => {
    setSelectedProject(project);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    projectSelectorRef.current?.scrollTo({ x: 0, animated: true });
  };

  const getDefectData = () => {
    const projectData = getProjectData(selectedProject);
    return projectData
      ? projectData.defectData
      : {
        high: {
          total: 0,
          reopen: 0,
          closed: 0,
          new: 0,
          reject: 0,
          open: 0,
          duplicate: 0,
          fixed: 0,
        },
        medium: {
          total: 0,
          reopen: 0,
          closed: 0,
          new: 0,
          reject: 0,
          open: 0,
          duplicate: 0,
          fixed: 0,
        },
        low: {
          total: 0,
          reopen: 0,
          closed: 0,
          new: 0,
          reject: 0,
          open: 0,
          duplicate: 0,
          fixed: 0,
        },
      };
  };

  const defectData = getDefectData();

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <TopHeader
        title={`${selectedProject} Details`}
        showLogout={true}
      />
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >

        <View style={styles.projectSelectorContainer}>
          <ProjectSelector
            ref={projectSelectorRef}
            projects={getOrderedProjects()}
            selectedProject={selectedProject}
            onProjectSelect={handleProjectSelect}
          />
        </View>

        <View style={styles.projectHeader}>
          <View style={styles.projectTitleWrapper}>
            <Text style={styles.projectTitle} numberOfLines={2} ellipsizeMode="tail">
              {selectedProject}
            </Text>
            <TouchableOpacity
              style={styles.projectDefectsButton}
              activeOpacity={0.8}
              onPress={() =>
                (navigation as any).navigate('Defects', {
                  projectName: selectedProject,
                })
              }
            >
              <Text style={styles.projectDefectsButtonText}>View Defects </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  currentRisk === 'high'
                    ? '#c62828'
                    : currentRisk === 'medium'
                      ? '#f9a825'
                      : '#2ecc40',
              },
            ]}
          >
            <Text style={styles.statusText}>
              {currentRisk === 'high'
                ? 'High Risk'
                : currentRisk === 'medium'
                  ? 'Medium Risk'
                  : 'Low Risk'}
            </Text>
          </View>
        </View>

         <SeverityBreakdown 
          defectData={defectData} 
        />

        <View style={styles.indicatorsContainer}>
          <DefectIndicators defectData={defectData} />
        </View>
      </ScrollView>
      {showScrollDownButton && (
        <TouchableOpacity
          style={styles.floatingScrollDown}
          activeOpacity={0.8}
          onPress={() => scrollViewRef.current?.scrollTo({ y: 430, animated: true })}
        >
          <Animated.View style={{ transform: [{ translateY: animY }] }}>
            <Ionicons name="chevron-down" size={22} color="#3b82f6" />
          </Animated.View>
        </TouchableOpacity>
      )}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100, // Add padding to prevent content from being hidden behind footer
    paddingTop: Platform.OS === 'ios' ? 124 : 80, // Add padding to prevent content from being hidden behind fixed header
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  backButtonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  projectSelectorContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
    paddingHorizontal: 0,
    paddingVertical: 12,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  projectTab: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeProjectTab: {
    backgroundColor: '#3b82f6',
  },
  projectTabText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeProjectTabText: {
    color: '#fff',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  projectTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
    flex: 1,
    flexShrink: 1,
    marginRight: 12,
  },
  projectTitleWrapper: {
    flex: 1,
    marginRight: 12,
  },
  projectDefectsButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  projectDefectsButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  defectCards: {
    paddingHorizontal: 24,
    gap: 16,
  },
  defectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  defectCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  defectTotal: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  defectStats: {
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  viewChartButton: {
    alignSelf: 'flex-start',
  },
  viewChartText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  indicatorsContainer: {
    marginBottom: 20,
  },
  floatingScrollDown: {
    position: 'absolute',
    bottom: 95, // Floating beautifully just above the footer navigation bar!
    alignSelf: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Translucent glassmorphism
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(219, 234, 254, 0.9)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 9999,
  },
});

export default ProjectDetails;
