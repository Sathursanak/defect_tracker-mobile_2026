import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import TopHeader from '../components/TopHeader';
import Footer from '../components/Footer';
import { mockProjects, getDefectsForProject, mockDefects, DefectRecord } from '../data/mockData';

type RootStackParamList = {
  Defects: {
    projectName?: string;
  };
};

type DefectsRouteProp = RouteProp<RootStackParamList, 'Defects'>;

const SEVERITY_FILTERS = ['All', 'High', 'Medium', 'Low'];
const STATUS_FILTERS = ['All', 'New', 'Open', 'In Progress', 'Fixed', 'Closed', 'Duplicate', 'Rejected'];

const Defects = () => {
  const navigation = useNavigation();
  const route = useRoute<DefectsRouteProp>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedProject, setSelectedProject] = useState<string>(
    route.params?.projectName || 'All Projects',
  );

  const defects: DefectRecord[] = useMemo(() => {
    if (selectedProject && selectedProject !== 'All Projects') {
      return getDefectsForProject(selectedProject);
    }
    return mockDefects;
  }, [selectedProject]);

  const filteredDefects = defects.filter(defect => {
    const matchesSearch =
      defect.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      defect.briefDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      defect.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      defect.submodule.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity =
      selectedSeverity === 'All' || defect.severity === selectedSeverity;

    const matchesStatus =
      selectedStatus === 'All' || defect.status === selectedStatus;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const projectOptions = ['All Projects', ...mockProjects.map(project => project.name)];

  return (
    <View style={styles.screen}>
      <TopHeader title="Defects" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.controlsRow}>
          <View style={styles.searchBox}>
            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search defects"
              placeholderTextColor="#9ca3af"
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity
            style={styles.viewAllButton}
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('Dashboard');
            }}
          >
            <Text style={styles.viewAllText}>Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.sectionTitle}>Project</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {projectOptions.map(project => (
              <TouchableOpacity
                key={project}
                style={[
                  styles.filterChip,
                  selectedProject === project && styles.filterChipActive,
                ]}
                onPress={() => setSelectedProject(project)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedProject === project && styles.filterTextActive,
                  ]}
                >
                  {project}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.sectionTitle}>Severity</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {SEVERITY_FILTERS.map(value => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.filterChip,
                  selectedSeverity === value && styles.filterChipActive,
                ]}
                onPress={() => setSelectedSeverity(value)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedSeverity === value && styles.filterTextActive,
                  ]}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.sectionTitle}>Status</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {STATUS_FILTERS.map(value => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.filterChip,
                  selectedStatus === value && styles.filterChipActive,
                ]}
                onPress={() => setSelectedStatus(value)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedStatus === value && styles.filterTextActive,
                  ]}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>{filteredDefects.length} Defects found</Text>
          <Text style={styles.summarySubtext}>
            {selectedProject === 'All Projects' ? 'All projects' : selectedProject}
          </Text>
        </View>

        {filteredDefects.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No defects found</Text>
            <Text style={styles.emptyDescription}>
              Adjust filters or search terms to locate defects.
            </Text>
          </View>
        ) : (
          filteredDefects.map(defect => (
            <View key={defect.id} style={styles.defectCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.defectId}>{defect.id}</Text>
                <View style={styles.statusBadge(defect.status)}>
                  <Text style={styles.statusBadgeText}>{defect.status}</Text>
                </View>
              </View>
              <Text style={styles.defectTitle}>{defect.briefDescription}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>{defect.module}</Text>
                <Text style={styles.metaLabel}>{defect.submodule}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaSmall}>Severity: {defect.severity}</Text>
                <Text style={styles.metaSmall}>Priority: {defect.priority}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaSmall}>Assigned: {defect.assignedTo}</Text>
                <Text style={styles.metaSmall}>Release: {defect.release}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    paddingTop: 90,
    paddingHorizontal: 16,
    paddingBottom: 140,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchInput: {
    fontSize: 14,
    color: '#111827',
  },
  viewAllButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  filterGroup: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#1f2937',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
  },
  filterText: {
    color: '#374151',
    fontSize: 13,
  },
  filterTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  summaryBar: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  summarySubtext: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptyDescription: {
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  defectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  defectId: {
    fontWeight: '700',
    fontSize: 14,
    color: '#111827',
  },
  statusBadge: (status: string) => ({
    backgroundColor:
      status === 'Open'
        ? '#fde68a'
        : status === 'In Progress'
        ? '#bfdbfe'
        : status === 'Fixed'
        ? '#d1fae5'
        : status === 'Closed'
        ? '#dbeafe'
        : status === 'Duplicate'
        ? '#f5f3ff'
        : status === 'Rejected'
        ? '#fee2e2'
        : '#e5e7eb',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  }),
  statusBadgeText: {
    color: '#111827',
    fontSize: 11,
    fontWeight: '700',
  },
  defectTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 6,
  },
  metaSmall: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default Defects;
