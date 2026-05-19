import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import TopHeader from '../components/TopHeader';
import Footer from '../components/Footer';
import ProjectSelector from '../components/ProjectSelector';
import SeverityBreakdown from '../components/SeverityBreakdown';
import { mockProjects, getProjectData, mockDefects, DefectRecord } from '../data/mockData';

type RootStackParamList = {
  Defects: {
    projectName?: string;
  };
};

type DefectsRouteProp = RouteProp<RootStackParamList, 'Defects'>;

const Defects = () => {
  const navigation = useNavigation();
  const route = useRoute<DefectsRouteProp>();
  
  const allProjects = mockProjects.map(p => p.name);
  const [selectedProject, setSelectedProject] = useState<string>(
    route.params?.projectName || allProjects[0],
  );

  // In-memory defect data state to allow reassignments to persist dynamically
  const [allMockDefects, setAllMockDefects] = useState<DefectRecord[]>(mockDefects);
  const [reassigningDefectId, setReassigningDefectId] = useState<string | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);

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

  const getOrderedProjects = () => {
    const ordered = [...allProjects];
    const selectedIndex = ordered.indexOf(selectedProject);
    if (selectedIndex > 0) {
      const [selected] = ordered.splice(selectedIndex, 1);
      ordered.unshift(selected);
    }
    return ordered;
  };

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
          high: { total: 0, reopen: 0, closed: 0, new: 0, reject: 0, open: 0, duplicate: 0, fixed: 0 },
          medium: { total: 0, reopen: 0, closed: 0, new: 0, reject: 0, open: 0, duplicate: 0, fixed: 0 },
          low: { total: 0, reopen: 0, closed: 0, new: 0, reject: 0, open: 0, duplicate: 0, fixed: 0 },
        };
  };

  const defectData = getDefectData();
  const currentRisk = getProjectData(selectedProject)?.risk || 'low';

  const projectDefects = useMemo(() => {
    return allMockDefects.filter(defect => defect.project === selectedProject);
  }, [allMockDefects, selectedProject]);

  const filteredDefects = useMemo(() => {
    return projectDefects.filter(defect => {
      const matchesSearch = 
        defect.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        defect.briefDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        defect.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
        defect.submodule.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesSeverity = selectedSeverity === 'All' || defect.severity === selectedSeverity;
      const matchesPriority = selectedPriority === 'All' || defect.priority === selectedPriority;
      const matchesStatus = selectedStatus === 'All' || defect.status === selectedStatus;
      
      return matchesSearch && matchesSeverity && matchesPriority && matchesStatus;
    });
  }, [projectDefects, searchTerm, selectedSeverity, selectedPriority, selectedStatus]);

  const handleReassign = (defectId: string, developer: string) => {
    setAllMockDefects(prev => 
      prev.map(d => d.id === defectId ? { ...d, assignedTo: developer } : d)
    );
    setReassigningDefectId(null);
    Alert.alert('Reassigned', `Defect has been reassigned to ${developer}.`);
  };

  const getStatusColors = (status: string) => {
    switch (status) {
      case 'New':
      case 'Open':
        return { bg: '#e0f2fe', text: '#0369a1' };
      case 'In Progress':
        return { bg: '#fef3c7', text: '#b45309' };
      case 'Fixed':
      case 'Closed':
        return { bg: '#dcfce7', text: '#15803d' };
      case 'Duplicate':
      case 'Rejected':
        return { bg: '#f3f4f6', text: '#4b5563' };
      default:
        return { bg: '#f3f4f6', text: '#1f2937' };
    }
  };

  return (
    <View style={styles.screen}>
      <TopHeader
        onBackPress={() => navigation.goBack()}
        title="Defects"
        showLogout={true}
      />
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.content}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        {/* Project Selector */}
        <View style={styles.projectSelectorContainer}>
          <ProjectSelector
            ref={projectSelectorRef}
            projects={getOrderedProjects()}
            selectedProject={selectedProject}
            onProjectSelect={handleProjectSelect}
          />
        </View>

        {/* Project Title Header */}
        <View style={styles.projectHeader}>
          <View style={styles.projectTitleWrapper}>
            <Text style={styles.projectTitle} numberOfLines={2} ellipsizeMode="tail">
              {selectedProject}
            </Text>
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
            <Text style={styles.statusText}>{currentRisk.toUpperCase()} RISK</Text>
          </View>
        </View>

        {/* Severity Breakdown */}
        <SeverityBreakdown 
          defectData={defectData} 
        />

        {/* Section Title */}
        <View style={styles.defectsSectionHeader}>
          <Text style={styles.sectionTitle}>Project Defects</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search defects by ID, title, or module..."
              placeholderTextColor="#9ca3af"
              style={styles.searchInput}
            />
            {searchTerm !== '' && (
              <TouchableOpacity onPress={() => setSearchTerm('')}>
                <Ionicons name="close-circle" size={18} color="#9ca3af" style={styles.clearSearchIcon} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filters Collapsible Bar */}
        <View style={styles.filtersContainer}>
          <TouchableOpacity 
            style={styles.filtersHeader} 
            activeOpacity={0.8}
            onPress={() => setIsFiltersExpanded(!isFiltersExpanded)}
          >
            <View style={styles.filtersHeaderLeft}>
              <Ionicons name="funnel-outline" size={18} color="#3b82f6" />
              <Text style={styles.filtersHeaderText}>Filters</Text>
              {(selectedSeverity !== 'All' || selectedPriority !== 'All' || selectedStatus !== 'All') && (
                <View style={styles.activeFiltersCountBadge}>
                  <Text style={styles.activeFiltersCountText}>
                    {[selectedSeverity, selectedPriority, selectedStatus].filter(v => v !== 'All').length}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.filtersHeaderRight}>
              {(selectedSeverity !== 'All' || selectedPriority !== 'All' || selectedStatus !== 'All') && (
                <TouchableOpacity 
                  onPress={(e) => {
                    e.stopPropagation();
                    setSelectedSeverity('All');
                    setSelectedPriority('All');
                    setSelectedStatus('All');
                  }}
                  style={styles.clearAllFiltersBtn}
                >
                  <Text style={styles.clearAllFiltersText}>Clear All</Text>
                </TouchableOpacity>
              )}
              <Ionicons 
                name={isFiltersExpanded ? "chevron-up" : "chevron-down"} 
                size={18} 
                color="#6b7280" 
              />
            </View>
          </TouchableOpacity>

          {isFiltersExpanded && (
            <View style={styles.filtersBody}>
              {/* Severity filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>Severity</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
                  {['All', 'High', 'Medium', 'Low'].map(option => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setSelectedSeverity(option)}
                      style={[
                        styles.filterChip,
                        selectedSeverity === option && styles.activeFilterChip,
                      ]}
                    >
                      <Text style={[styles.filterChipText, selectedSeverity === option && styles.activeFilterChipText]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Priority filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>Priority</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
                  {['All', 'Critical', 'High', 'Medium', 'Low'].map(option => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setSelectedPriority(option)}
                      style={[
                        styles.filterChip,
                        selectedPriority === option && styles.activeFilterChip,
                      ]}
                    >
                      <Text style={[styles.filterChipText, selectedPriority === option && styles.activeFilterChipText]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Status filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>Status</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
                  {['All', 'New', 'Open', 'In Progress', 'Fixed', 'Closed', 'Duplicate', 'Rejected'].map(option => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setSelectedStatus(option)}
                      style={[
                        styles.filterChip,
                        selectedStatus === option && styles.activeFilterChip,
                      ]}
                    >
                      <Text style={[styles.filterChipText, selectedStatus === option && styles.activeFilterChipText]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}
        </View>

        {/* Defects List Cards */}
        <View style={styles.defectsListContainer}>
          {filteredDefects.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="bug-outline" size={48} color="#9ca3af" style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>No defects found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your filters or search criteria</Text>
            </View>
          ) : (
            filteredDefects.map(defect => {
              const statusColors = getStatusColors(defect.status);
              const severityColor = defect.severity === 'High' ? '#ef4444' : defect.severity === 'Medium' ? '#f59e0b' : '#10b981';
              const priorityColor = defect.priority === 'Critical' ? '#dc2626' : defect.priority === 'High' ? '#ef4444' : defect.priority === 'Medium' ? '#f59e0b' : '#3b82f6';
              
              return (
                <View key={defect.id} style={styles.defectCard}>
                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Text style={styles.defectId}>{defect.id}</Text>
                      <View style={styles.moduleTag}>
                        <Text style={styles.moduleTagText}>{defect.module} &gt; {defect.submodule}</Text>
                      </View>
                    </View>
                    <View style={[styles.cardStatusBadge, { backgroundColor: statusColors.bg }]}>
                      <Text style={[styles.cardStatusText, { color: statusColors.text }]}>{defect.status}</Text>
                    </View>
                  </View>

                  {/* Card Description */}
                  <Text style={styles.defectDescription}>{defect.briefDescription}</Text>
                  
                  {/* Card Steps */}
                  <View style={styles.stepsContainer}>
                    <Text style={styles.stepsTitle}>Steps to Reproduce:</Text>
                    <Text style={styles.stepsText} numberOfLines={3} ellipsizeMode="tail">{defect.steps}</Text>
                  </View>

                  {/* Card Footer tags */}
                  <View style={styles.cardFooter}>
                    <View style={styles.pillsRow}>
                      <View style={[styles.pillBadge, { borderColor: severityColor }]}>
                        <View style={[styles.pillDot, { backgroundColor: severityColor }]} />
                        <Text style={[styles.pillText, { color: severityColor }]}>{defect.severity}</Text>
                      </View>
                      <View style={[styles.pillBadge, { borderColor: priorityColor }]}>
                        <View style={[styles.pillDot, { backgroundColor: priorityColor }]} />
                        <Text style={[styles.pillText, { color: priorityColor }]}>{defect.priority}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.rightFooterRow}>
                      <View style={styles.assignedContainer}>
                        <Ionicons name="person-circle-outline" size={16} color="#6b7280" />
                        <Text style={styles.assignedText}>{defect.assignedTo}</Text>
                      </View>
                      
                      <TouchableOpacity 
                        style={styles.reassignButton}
                        activeOpacity={0.7}
                        onPress={() => setReassigningDefectId(reassigningDefectId === defect.id ? null : defect.id)}
                      >
                        <Ionicons name="people-outline" size={14} color="#3b82f6" />
                        <Text style={styles.reassignButtonText}>Reassign</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Collapsible Reassign Developer Selector */}
                  {reassigningDefectId === defect.id && (
                    <View style={styles.reassignContainer}>
                      <Text style={styles.reassignTitle}>Reassign Developer:</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reassignChipsRow}>
                        {['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Grace', 'Heidi', 'Ivan', 'Judy'].map(dev => (
                          <TouchableOpacity
                            key={dev}
                            onPress={() => handleReassign(defect.id, dev)}
                            style={[
                              styles.reassignChip,
                              defect.assignedTo === dev && styles.activeReassignChip
                            ]}
                          >
                            <Text style={[styles.reassignChipText, defect.assignedTo === dev && styles.activeReassignChipText]}>
                              {dev}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              );
            })
          )}
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
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingTop: Platform.OS === 'ios' ? 124 : 80,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  projectSelectorContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 0,
  },
  projectTitleWrapper: {
    flex: 1,
    marginRight: 12,
  },
  projectTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3b82f6',
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
  defectsSectionHeader: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
    paddingVertical: 8,
  },
  clearSearchIcon: {
    marginLeft: 4,
  },
  filtersContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 16,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
  },
  filtersHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filtersHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  activeFiltersCountBadge: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  activeFiltersCountText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  filtersHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearAllFiltersBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  clearAllFiltersText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  filtersBody: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 14,
  },
  filterGroup: {
    gap: 6,
  },
  filterGroupTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterChipsRow: {
    gap: 8,
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activeFilterChip: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterChipText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
  },
  activeFilterChipText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  defectsListContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 40,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emptyIcon: {
    marginBottom: 12,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b5563',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  defectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardHeaderLeft: {
    flex: 1,
    gap: 4,
  },
  defectId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  moduleTag: {
    alignSelf: 'flex-start',
  },
  moduleTagText: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  cardStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardStatusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  defectDescription: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 10,
  },
  stepsContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  stepsTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 2,
  },
  stepsText: {
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    gap: 4,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  rightFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  assignedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  assignedText: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
  },
  reassignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  reassignButtonText: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '600',
  },
  reassignContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    gap: 6,
  },
  reassignTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reassignChipsRow: {
    gap: 6,
    paddingVertical: 2,
  },
  reassignChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activeReassignChip: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  reassignChipText: {
    fontSize: 11,
    color: '#4b5563',
    fontWeight: '500',
  },
  activeReassignChipText: {
    color: '#ffffff',
    fontWeight: '600',
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

export default Defects;
