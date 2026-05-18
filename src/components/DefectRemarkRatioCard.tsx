import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DefectRemarkRatioCardProps {
  defectCount: number;
  remarkCount: number;
  title?: string;
}

const DefectRemarkRatioCard: React.FC<DefectRemarkRatioCardProps> = ({
  defectCount,
  remarkCount,
  title = 'Defect to Remark Ratio',
}) => {
  // Calculate percentage: (defects / (defects + remarks)) * 100
  const totalItems = defectCount + remarkCount;
  const percentage = totalItems > 0 ? (defectCount / totalItems) * 100 : 0;
  const displayPercentage = percentage.toFixed(2);

  // Determine severity level based on percentage
  const getSeverityLevel = (percentage: number) => {
    if (percentage <= 30) return { level: 'Low', color: '#10b981' };
    if (percentage <= 60) return { level: 'Medium', color: '#f59e0b' };
    return { level: 'High', color: '#ef4444' };
  };

  const severity = getSeverityLevel(percentage);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={[styles.card, { backgroundColor: severity.color + '20' }]}>
        <Text style={[styles.percentage, { color: severity.color }]}>
          {displayPercentage}%
        </Text>
        <Text style={styles.subtitle}>
          Defect to Remark Ratio (%)
        </Text>
        
        <View style={[styles.severityBadge, { backgroundColor: severity.color }]}>
          <Text style={styles.severityText}>{severity.level}</Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Defects</Text>
          <Text style={styles.detailValue}>{defectCount}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Remarks</Text>
          <Text style={styles.detailValue}>{remarkCount}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.detailValue}>{totalItems}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 280,
    minHeight: 160,
    marginBottom: 16,
  },
  percentage: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  severityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  severityText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});

export default DefectRemarkRatioCard;
