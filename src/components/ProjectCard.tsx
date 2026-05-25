import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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

const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  risk,
  riskColor,
  icon,
  size,
  style,
}) => {
  const navigation = useNavigation();

  const handlePress = () => {
    (navigation as { navigate: (screen: string, params: object) => void }).navigate(
      'ProjectDetails',
      { projectName: name, risk },
    );
  };

  const circleSize = size - 32;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={name}
      style={[styles.touchable, { width: size }, style]}
    >
      <View style={styles.cardShell}>
        <View style={styles.chevronBadge}>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </View>
        <View
          style={[
            styles.circleCard,
            { backgroundColor: riskColor, width: circleSize, height: circleSize },
          ]}
        >
          <View style={styles.iconContainer}>{icon}</View>
          <Text style={styles.projectName} numberOfLines={2}>
            {name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginBottom: 8,
    alignSelf: 'center',
  },
  cardShell: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  chevronBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  circleCard: {
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  iconContainer: {
    marginBottom: 6,
  },
  projectName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 6,
  },
});

export default ProjectCard;
