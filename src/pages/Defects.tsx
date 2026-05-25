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
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import TopHeader from '../components/TopHeader';
import Footer from '../components/Footer';
import ProjectSelector from '../components/ProjectSelector';
import SeverityBreakdown from '../components/SeverityBreakdown';
import { DefectRecord } from '../data/mockData';
import * as api from '../services/api';

type RootStackParamList = {
  Defects: {
    projectName?: string;
  };
};

type DefectsRouteProp = RouteProp<RootStackParamList, 'Defects'>;

const getStatusHistoryPath = (currentStatus: string): string[] => {
  const status = currentStatus.trim();
  if (status === 'New') {
    return ['New'];
  }
  if (status === 'Open') {
    return ['New', 'Open'];
  }
  if (status === 'In Progress') {
    return ['New', 'Open', 'In Progress'];
  }
  if (status === 'Fixed') {
    return ['New', 'Open', 'In Progress', 'Fixed'];
  }
  if (status === 'Closed') {
    return ['New', 'Open', 'In Progress', 'Fixed', 'Closed'];
  }
  if (status === 'Duplicate' || status === 'Rejected') {
    return ['New', 'Open', status];
  }
  return ['New', 'Open', status];
};

const Defects = () => {
  const navigation = useNavigation();
  const route = useRoute<DefectsRouteProp>();

  const [projects, setProjects] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');

  const [filteredDefects, setFilteredDefects] = useState<DefectRecord[]>([]);
  const [expandedCardIds, setExpandedCardIds] = useState<string[]>([]);
  const [activeStatusDropdownId, setActiveStatusDropdownId] = useState<string | null>(null);
  const [activeAssigneeDropdownId, setActiveAssigneeDropdownId] = useState<string | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedModule, setSelectedModule] = useState('All');
  const [selectedSubmodule, setSelectedSubmodule] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedRelease, setSelectedRelease] = useState('All');
  const [selectedAssignedTo, setSelectedAssignedTo] = useState('All');
  const [selectedEnteredBy, setSelectedEnteredBy] = useState('All');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);

  // API Loading States
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [defectsLoading, setDefectsLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filter lists fetched from API dynamically
  const [filterOptions, setFilterOptions] = useState<api.FilterOptions>({
    modules: [],
    submodules: [],
    types: [],
    releases: [],
    developers: [],
    enteredBy: [],
  });

  const [projectDetails, setProjectDetails] = useState<any>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const projectSelectorRef = useRef<ScrollView>(null);

  const animY = useRef(new Animated.Value(-4)).current;
  const [showScrollDownButton, setShowScrollDownButton] = useState(true);

  // Initialize projects list
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const names = await api.getProjects();
        setProjects(names);
        const initial = route.params?.projectName || names[0] || '';
        setSelectedProject(initial);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, [route.params]);

  // Fetch unique filter options and project risk metadata when project switches
  useEffect(() => {
    if (!selectedProject) return;

    const fetchProjectDetailsAndFilters = async () => {
      setFiltersLoading(true);
      try {
        const details = await api.getProjectDetails(selectedProject);
        setProjectDetails(details);

        const options = await api.getFilterOptions(selectedProject);
        setFilterOptions(options);
      } catch (error) {
        console.error('Error fetching details/filters:', error);
      } finally {
        setFiltersLoading(false);
      }
    };

    fetchProjectDetailsAndFilters();
  }, [selectedProject, refreshTrigger]);

  // Fetch filtered defects from API whenever any filter parameter changes (debounced search)
  useEffect(() => {
    if (!selectedProject) return;

    const fetchDefects = async () => {
      setDefectsLoading(true);
      try {
        const data = await api.getDefects({
          project: selectedProject,
          search: searchTerm,
          severity: selectedSeverity !== 'All' ? selectedSeverity : undefined,
          priority: selectedPriority !== 'All' ? selectedPriority : undefined,
          status: selectedStatus !== 'All' ? selectedStatus : undefined,
          module: selectedModule !== 'All' ? selectedModule : undefined,
          submodule: selectedSubmodule !== 'All' ? selectedSubmodule : undefined,
          type: selectedType !== 'All' ? selectedType : undefined,
          release: selectedRelease !== 'All' ? selectedRelease : undefined,
          assignedTo: selectedAssignedTo !== 'All' ? selectedAssignedTo : undefined,
          enteredBy: selectedEnteredBy !== 'All' ? selectedEnteredBy : undefined,
        });
        setFilteredDefects(data);
      } catch (error) {
        console.error('Error loading defects:', error);
      } finally {
        setDefectsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchDefects();
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [
    selectedProject,
    searchTerm,
    selectedSeverity,
    selectedPriority,
    selectedStatus,
    selectedModule,
    selectedSubmodule,
    selectedType,
    selectedRelease,
    selectedAssignedTo,
    selectedEnteredBy,
    refreshTrigger,
  ]);

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
    const ordered = [...projects];
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

    // Reset filters for new project to avoid mismatching lookups
    setSelectedSeverity('All');
    setSelectedPriority('All');
    setSelectedStatus('All');
    setSelectedModule('All');
    setSelectedSubmodule('All');
    setSelectedType('All');
    setSelectedRelease('All');
    setSelectedAssignedTo('All');
    setSelectedEnteredBy('All');
  };

  const defectData = projectDetails?.defectData || {
    high: { total: 0, reopen: 0, closed: 0, new: 0, reject: 0, open: 0, duplicate: 0, fixed: 0 },
    medium: { total: 0, reopen: 0, closed: 0, new: 0, reject: 0, open: 0, duplicate: 0, fixed: 0 },
    low: { total: 0, reopen: 0, closed: 0, new: 0, reject: 0, open: 0, duplicate: 0, fixed: 0 },
  };
  const currentRisk = projectDetails?.risk || 'low';

  // Dynamic filter lists extraction from state
  const modulesList = useMemo(() => ['All', ...filterOptions.modules], [filterOptions]);
  const submodulesList = useMemo(() => ['All', ...filterOptions.submodules], [filterOptions]);
  const typesList = useMemo(() => ['All', ...filterOptions.types], [filterOptions]);
  const releasesList = useMemo(() => ['All', ...filterOptions.releases], [filterOptions]);
  const developersList = useMemo(() => ['All', ...filterOptions.developers], [filterOptions]);
  const enteredByList = useMemo(() => ['All', ...filterOptions.enteredBy], [filterOptions]);

  const handleReassign = async (defectId: string, developer: string) => {
    try {
      await api.reassignDefect(defectId, developer);
      setActiveAssigneeDropdownId(null);
      Alert.alert('Reassigned', `Defect has been reassigned to ${developer}.`);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      Alert.alert('Error', 'Failed to reassign developer.');
    }
  };

  const handleStatusChange = async (defectId: string, newStatus: DefectRecord['status']) => {
    try {
      await api.updateDefectStatus(defectId, newStatus);
      setActiveStatusDropdownId(null);
      Alert.alert('Status Updated', `Defect ${defectId} status changed to ${newStatus}.`);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      Alert.alert('Error', 'Failed to update status.');
    }
  };

  const toggleCardExpansion = (defectId: string) => {
    setExpandedCardIds(prev =>
      prev.includes(defectId) ? prev.filter(id => id !== defectId) : [...prev, defectId]
    );
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


  if (projectsLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        <TopHeader
          onBackPress={() => navigation.goBack()}
          title="Defects"
          showLogout={true}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={{ marginTop: 12, color: '#6b7280', fontSize: 15, fontWeight: '600' }}>Loading Projects...</Text>
        </View>
        <Footer />
      </View>
    );
  }

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
              {(selectedSeverity !== 'All' ||
                selectedPriority !== 'All' ||
                selectedStatus !== 'All' ||
                selectedModule !== 'All' ||
                selectedSubmodule !== 'All' ||
                selectedType !== 'All' ||
                selectedRelease !== 'All' ||
                selectedAssignedTo !== 'All' ||
                selectedEnteredBy !== 'All') && (
                  <View style={styles.activeFiltersCountBadge}>
                    <Text style={styles.activeFiltersCountText}>
                      {[
                        selectedSeverity,
                        selectedPriority,
                        selectedStatus,
                        selectedModule,
                        selectedSubmodule,
                        selectedType,
                        selectedRelease,
                        selectedAssignedTo,
                        selectedEnteredBy,
                      ].filter(v => v !== 'All').length}
                    </Text>
                  </View>
                )}
            </View>
            <View style={styles.filtersHeaderRight}>
              {(selectedSeverity !== 'All' ||
                selectedPriority !== 'All' ||
                selectedStatus !== 'All' ||
                selectedModule !== 'All' ||
                selectedSubmodule !== 'All' ||
                selectedType !== 'All' ||
                selectedRelease !== 'All' ||
                selectedAssignedTo !== 'All' ||
                selectedEnteredBy !== 'All') && (
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      setSelectedSeverity('All');
                      setSelectedPriority('All');
                      setSelectedStatus('All');
                      setSelectedModule('All');
                      setSelectedSubmodule('All');
                      setSelectedType('All');
                      setSelectedRelease('All');
                      setSelectedAssignedTo('All');
                      setSelectedEnteredBy('All');
                    }}
                    style={styles.clearAllFiltersBtn}
                  >
                    <Text style={styles.clearAllFiltersText}>Clear All Filters</Text>
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
              {/* Module filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>Module</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
                  {modulesList.map(option => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => {
                        setSelectedModule(option);
                        setSelectedSubmodule('All'); // Reset submodule when module changes
                      }}
                      style={[
                        styles.filterChip,
                        selectedModule === option && styles.activeFilterChip,
                      ]}
                    >
                      <Text style={[styles.filterChipText, selectedModule === option && styles.activeFilterChipText]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Submodule filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>Submodule</Text>
                {selectedModule === 'All' ? (
                  <View style={styles.disabledContainer}>
                    <Ionicons name="lock-closed-outline" size={14} color="#9ca3af" />
                    <Text style={styles.disabledText}>Select modules first</Text>
                  </View>
                ) : (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
                    {submodulesList.map(option => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => setSelectedSubmodule(option)}
                        style={[
                          styles.filterChip,
                          selectedSubmodule === option && styles.activeFilterChip,
                        ]}
                      >
                        <Text style={[styles.filterChipText, selectedSubmodule === option && styles.activeFilterChipText]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>

              {/* Type filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>Type</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
                  {typesList.map(option => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setSelectedType(option)}
                      style={[
                        styles.filterChip,
                        selectedType === option && styles.activeFilterChip,
                      ]}
                    >
                      <Text style={[styles.filterChipText, selectedType === option && styles.activeFilterChipText]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

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

              {/* Release filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>Release</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
                  {releasesList.map(option => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setSelectedRelease(option)}
                      style={[
                        styles.filterChip,
                        selectedRelease === option && styles.activeFilterChip,
                      ]}
                    >
                      <Text style={[styles.filterChipText, selectedRelease === option && styles.activeFilterChipText]}>
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

              {/* Assigned To filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>Assigned To</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
                  {developersList.map(option => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setSelectedAssignedTo(option)}
                      style={[
                        styles.filterChip,
                        selectedAssignedTo === option && styles.activeFilterChip,
                      ]}
                    >
                      <Text style={[styles.filterChipText, selectedAssignedTo === option && styles.activeFilterChipText]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Entered By filter */}
              <View style={styles.filterGroup}>
                <Text style={styles.filterGroupTitle}>Entered By</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipsRow}>
                  {enteredByList.map(option => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => setSelectedEnteredBy(option)}
                      style={[
                        styles.filterChip,
                        selectedEnteredBy === option && styles.activeFilterChip,
                      ]}
                    >
                      <Text style={[styles.filterChipText, selectedEnteredBy === option && styles.activeFilterChipText]}>
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
          {defectsLoading ? (
            <View style={{ paddingVertical: 60, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={{ marginTop: 12, color: '#6b7280', fontSize: 14, fontWeight: '500' }}>Fetching defect list...</Text>
            </View>
          ) : filteredDefects.length === 0 ? (
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
              const isExpanded = expandedCardIds.includes(defect.id);
              const isStatusDropdownOpen = activeStatusDropdownId === defect.id;
              const isAssigneeDropdownOpen = activeAssigneeDropdownId === defect.id;

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

                    {/* Status Dropdown Trigger */}
                    <TouchableOpacity
                      style={[styles.cardStatusBadgeDropdown, { backgroundColor: statusColors.bg }]}
                      activeOpacity={0.7}
                      onPress={() => {
                        setActiveAssigneeDropdownId(null);
                        setActiveStatusDropdownId(isStatusDropdownOpen ? null : defect.id);
                      }}
                    >
                      <Text style={[styles.cardStatusText, { color: statusColors.text }]}>{defect.status}</Text>
                      <Ionicons name={isStatusDropdownOpen ? "chevron-up" : "chevron-down"} size={12} color={statusColors.text} style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                  </View>

                  {/* Status Dropdown Options List */}
                  {isStatusDropdownOpen && (
                    <View style={styles.dropdownOptionsContainer}>
                      <Text style={styles.dropdownTitle}>Change Status:</Text>
                      <View style={styles.dropdownOptionsGrid}>
                        {(['New', 'Open', 'In Progress', 'Fixed', 'Closed', 'Duplicate', 'Rejected'] as const).map(st => {
                          const stColors = getStatusColors(st);
                          const isCurrent = defect.status === st;
                          return (
                            <TouchableOpacity
                              key={st}
                              style={[
                                styles.dropdownOptionItem,
                                { backgroundColor: stColors.bg },
                                isCurrent && { borderWidth: 1.5, borderColor: stColors.text }
                              ]}
                              onPress={() => handleStatusChange(defect.id, st)}
                            >
                              <Text style={[styles.dropdownOptionText, { color: stColors.text, fontWeight: isCurrent ? 'bold' : 'normal' }]}>
                                {st}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  )}

                  {/* Card Description */}
                  <Text style={styles.defectDescription}>{defect.briefDescription}</Text>

                  {/* Card Footer */}
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
                      {/* Interactive Assignee Dropdown Trigger */}
                      <TouchableOpacity
                        style={[
                          styles.assignedContainerDropdown,
                          isAssigneeDropdownOpen && styles.assignedContainerDropdownActive
                        ]}
                        activeOpacity={0.7}
                        onPress={() => {
                          setActiveStatusDropdownId(null);
                          setActiveAssigneeDropdownId(isAssigneeDropdownOpen ? null : defect.id);
                        }}
                      >
                        <Ionicons name="person-circle-outline" size={16} color="#3b82f6" />
                        <Text style={styles.assignedText}>{defect.assignedTo}</Text>
                        <Ionicons name={isAssigneeDropdownOpen ? "chevron-up" : "chevron-down"} size={12} color="#6b7280" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Assignee Dropdown Options List */}
                  {isAssigneeDropdownOpen && (
                    <View style={styles.dropdownOptionsContainer}>
                      <Text style={styles.dropdownTitle}>Reassign Developer:</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reassignChipsRow}>
                        {['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Grace', 'Heidi', 'Ivan', 'Judy'].map(dev => {
                          const isCurrent = defect.assignedTo === dev;
                          return (
                            <TouchableOpacity
                              key={dev}
                              onPress={() => handleReassign(defect.id, dev)}
                              style={[
                                styles.reassignChip,
                                isCurrent && styles.activeReassignChip
                              ]}
                            >
                              <Text style={[styles.reassignChipText, isCurrent && styles.activeReassignChipText]}>
                                {dev}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  )}

                  {/* Accordion Expandable Detailed Section */}
                  {isExpanded && (
                    <View style={styles.expandedDetailsSection}>

                      {/* Steps to Reproduce */}
                      <View style={styles.detailsBlock}>
                        <Text style={styles.detailsBlockTitle}>Steps to Reproduce:</Text>
                        <View style={styles.stepsInnerContainer}>
                          <Text style={styles.stepsText}>{defect.steps}</Text>
                        </View>
                      </View>

                      {/* Sleek Attachment Container */}
                      <View style={styles.detailsBlock}>
                        <Text style={styles.detailsBlockTitle}>Attachment:</Text>
                        {defect.attachment ? (
                          <View style={styles.attachmentBox}>
                            <Ionicons name="document-attach-outline" size={18} color="#3b82f6" />
                            <Text style={styles.attachmentName} numberOfLines={1}>{defect.attachment}</Text>
                            <TouchableOpacity
                              style={styles.attachmentViewBtn}
                              onPress={() => Alert.alert('Open File', `Opening attachment: ${defect.attachment}`)}
                            >
                              <Text style={styles.attachmentViewBtnText}>View File</Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View style={styles.noAttachmentBox}>
                            <Ionicons name="document-outline" size={14} color="#9ca3af" />
                            <Text style={styles.noAttachmentText}>No attachments uploaded</Text>
                          </View>
                        )}
                      </View>

                      {/* Technical Details Grid */}
                      <View style={styles.detailsGrid}>
                        <View style={styles.detailsGridCell}>
                          <Text style={styles.detailsGridLabel}>Type</Text>
                          <Text style={styles.detailsGridValue}>{defect.type}</Text>
                        </View>
                        <View style={styles.detailsGridCell}>
                          <Text style={styles.detailsGridLabel}>Release</Text>
                          <Text style={styles.detailsGridValue}>{defect.release}</Text>
                        </View>
                        <View style={styles.detailsGridCell}>
                          <Text style={styles.detailsGridLabel}>Entered By</Text>
                          <Text style={styles.detailsGridValue}>{defect.enteredBy}</Text>
                        </View>
                      </View>

                      {/* History Log Timeline (Simple horizontal path status flow) */}
                      <View style={styles.detailsBlock}>
                        <Text style={styles.detailsBlockTitle}>Defect Life Cycle History:</Text>
                        <View style={styles.historyPathContainer}>
                          {getStatusHistoryPath(defect.status).map((step, idx, arr) => (
                            <React.Fragment key={idx}>
                              <View style={[
                                styles.historyStepBadge,
                                idx === arr.length - 1 ? styles.activeHistoryStepBadge : styles.inactiveHistoryStepBadge
                              ]}>
                                <Text style={[
                                  styles.historyStepText,
                                  idx === arr.length - 1 ? styles.activeHistoryStepText : styles.inactiveHistoryStepText
                                ]}>
                                  {step}
                                </Text>
                              </View>
                              {idx < arr.length - 1 && (
                                <Ionicons name="arrow-forward" size={12} color="#9ca3af" style={{ marginHorizontal: 2 }} />
                              )}
                            </React.Fragment>
                          ))}
                        </View>
                      </View>

                    </View>
                  )}

                  {/* Accordion Expansion Trigger Button */}
                  <TouchableOpacity
                    style={styles.accordionToggleBtn}
                    activeOpacity={0.6}
                    onPress={() => toggleCardExpansion(defect.id)}
                  >
                    <Text style={styles.accordionToggleBtnText}>
                      {isExpanded ? "Hide Details" : "Show More Details"}
                    </Text>
                    <Ionicons
                      name={isExpanded ? "chevron-up" : "chevron-down"}
                      size={14}
                      color="#3b82f6"
                      style={{ marginLeft: 4 }}
                    />
                  </TouchableOpacity>

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
    paddingBottom: 130, // Sleek bottom padding so the last defect card scrolls completely clear of the footer!
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
  disabledContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  disabledText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
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
  cardStatusBadgeDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  cardStatusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  dropdownOptionsContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  dropdownTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dropdownOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dropdownOptionItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dropdownOptionText: {
    fontSize: 10,
    fontWeight: '600',
  },
  defectDescription: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 10,
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
  assignedContainerDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  assignedContainerDropdownActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#dbeafe',
  },
  assignedText: {
    fontSize: 11,
    color: '#1d4ed8',
    fontWeight: '600',
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
  expandedDetailsSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    gap: 12,
  },
  detailsBlock: {
    gap: 4,
  },
  detailsBlockTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stepsInnerContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  stepsText: {
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 18,
  },
  attachmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
  },
  attachmentName: {
    flex: 1,
    fontSize: 11,
    color: '#1d4ed8',
    fontWeight: '500',
  },
  attachmentViewBtn: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  attachmentViewBtnText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  noAttachmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  noAttachmentText: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  detailsGridCell: {
    flex: 1,
    alignItems: 'center',
  },
  detailsGridLabel: {
    fontSize: 8,
    color: '#9ca3af',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  detailsGridValue: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '600',
  },
  timelineContainer: {
    paddingLeft: 4,
    marginTop: 4,
  },
  timelineRow: {
    flexDirection: 'row',
  },
  timelineLeftColumn: {
    alignItems: 'center',
    marginRight: 10,
    width: 12,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    borderWidth: 1.5,
    borderColor: '#ffffff',
    zIndex: 10,
    marginTop: 4,
  },
  activeTimelineDot: {
    backgroundColor: '#3b82f6',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  timelineLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: '#e5e7eb',
    marginTop: -2,
    marginBottom: -4,
  },
  timelineContentCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 10,
    gap: 3,
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  timelineUser: {
    fontSize: 10,
    fontWeight: '700',
    color: '#374151',
  },
  timelineTime: {
    fontSize: 9,
    color: '#9ca3af',
  },
  timelineNote: {
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 14,
  },
  timelineBadgeRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  timelineStatusBadge: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  timelineStatusText: {
    fontSize: 8,
    color: '#4b5563',
    fontWeight: 'bold',
  },
  accordionToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  accordionToggleBtnText: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '700',
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
  historyPathContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginTop: 6,
    gap: 4,
  },
  historyStepBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  activeHistoryStepBadge: {
    backgroundColor: '#3b82f6',
  },
  inactiveHistoryStepBadge: {
    backgroundColor: '#e5e7eb',
  },
  historyStepText: {
    fontSize: 10,
    fontWeight: '700',
  },
  activeHistoryStepText: {
    color: '#ffffff',
  },
  inactiveHistoryStepText: {
    color: '#4b5563',
  },
});

export default Defects;
