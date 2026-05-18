import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface ProjectCardProps {
  name: string;
  risk: string;
  riskColor: string;
  riskLabel: string;
  icon: React.ReactNode;
  size: number;
  style?: ViewStyle;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ name, risk, riskColor, icon, size, style }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    (navigation as any).navigate('ProjectDetails', {
      projectName: name,
      risk: risk,
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View style={[styles.projectCardWrapper, { width: size, height: size }, style]}>
        <View style={[styles.circleCard, { backgroundColor: riskColor, width: size - 16, height: size - 16 }]}>
          <View style={styles.iconContainer}>
            {icon}
          </View>
          <Text style={styles.projectName}>{name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  projectCardWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginHorizontal: 4,
    width: '48%',
  },
  circleCard: {
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    marginBottom: 8,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  riskLabelWrapper: {
    alignItems: 'center',
  },
  riskLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default ProjectCard; 
