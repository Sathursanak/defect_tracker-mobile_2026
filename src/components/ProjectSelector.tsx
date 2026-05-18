import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ProjectSelectorProps {
  projects: string[];
  selectedProject: string;
  onProjectSelect: (project: string) => void;
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  projects,
  selectedProject,
  onProjectSelect
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollLeft = () => {
    scrollViewRef.current?.scrollTo({ x: -100, animated: true });
  };

  const scrollRight = () => {
    scrollViewRef.current?.scrollTo({ x: 100, animated: true });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.scrollIndicator} onPress={scrollLeft}>
        <Ionicons name="chevron-back" size={16} color="#6b7280" />
      </TouchableOpacity>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.projectSelector}
        contentContainerStyle={styles.projectSelectorContent}
      >
        {projects.map((project) => (
          <TouchableOpacity
            key={project}
            style={[
              styles.projectTab,
              project === selectedProject && styles.activeProjectTab
            ]}
            onPress={() => onProjectSelect(project)}
          >
            <Text style={[
              styles.projectTabText,
              project === selectedProject && styles.activeProjectTabText
            ]}>
              {project}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.scrollIndicator} onPress={scrollRight}>
        <Ionicons name="chevron-forward" size={16} color="#6b7280" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  scrollIndicator: {
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  projectSelector: {
    flex: 1,
    marginHorizontal: 1,
  },
  projectSelectorContent: {
    paddingHorizontal: 8,
  },
  projectTab: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    minWidth: 80,
  },
  activeProjectTab: {
    backgroundColor: '#60A5FA',
  },
  projectTabText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeProjectTabText: {
    color: '#fff',
  },
});

export default ProjectSelector;



