import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SeverityIndexIndicator from '../SeverityIndexIndicator';

const SeverityIndexDemo: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Severity Index Indicator Demo</Text>
      
      <View style={styles.demoSection}>
        <Text style={styles.sectionTitle}>Low Severity (0.8)</Text>
        <SeverityIndexIndicator value={0.8} size={180} />
      </View>

      <View style={styles.demoSection}>
        <Text style={styles.sectionTitle}>Medium Severity (1.5)</Text>
        <SeverityIndexIndicator value={1.5} size={180} />
      </View>

      <View style={styles.demoSection}>
        <Text style={styles.sectionTitle}>High Severity (2.4)</Text>
        <SeverityIndexIndicator value={2.4} size={180} />
      </View>

      <View style={styles.demoSection}>
        <Text style={styles.sectionTitle}>Maximum Severity (3.0)</Text>
        <SeverityIndexIndicator value={3.0} size={180} />
      </View>

      <View style={styles.demoSection}>
        <Text style={styles.sectionTitle}>Custom Title & Size</Text>
        <SeverityIndexIndicator 
          value={1.8} 
          size={150} 
          title="Project Risk Level"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  demoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default SeverityIndexDemo;
