import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { getDefectBreakdown } from '../data/mockData';

interface DefectData {
  total: number;
  reopen: number;
  closed: number;
  new: number;
  reject: number;
  open: number;
  duplicate: number;
  fixed: number;
}

interface DefectsByModuleChartProps {
  defectData: {
    high: DefectData;
    medium: DefectData;
    low: DefectData;
  };
}

const DefectsByModuleChart: React.FC<DefectsByModuleChartProps> = ({
  defectData,
}) => {
  const widthAndHeight = 220;

  // Use centralized defect breakdown calculation
  const breakdown = getDefectBreakdown(defectData);

  // Calculate module distribution proportionally
  const authDefects = Math.round(breakdown.totalDefects * 0.3); // 30%
  const dashboardDefects = Math.round(breakdown.totalDefects * 0.25); // 25%
  const reportsDefects = Math.round(breakdown.totalDefects * 0.2); // 20%
  const settingsDefects = Math.round(breakdown.totalDefects * 0.15); // 15%
  const apiDefects =
    breakdown.totalDefects -
    (authDefects + dashboardDefects + reportsDefects + settingsDefects); // Remaining

  const moduleData = [
    {
      value: authDefects,
      color: '#3b82f6',
      label: { text: 'Auth', fontSize: 10 },
    },
    {
      value: dashboardDefects,
      color: '#10b981',
      label: { text: 'Dashboard', fontSize: 10 },
    },
    {
      value: reportsDefects,
      color: '#f59e0b',
      label: { text: 'Reports', fontSize: 10 },
    },
    {
      value: settingsDefects,
      color: '#ef4444',
      label: { text: 'Settings', fontSize: 10 },
    },
    {
      value: apiDefects,
      color: '#8b5cf6',
      label: { text: 'API', fontSize: 10 },
    },
  ].filter(item => item.value > 0);

  const total = breakdown.totalDefects;

  return (
    <View style={styles.container}>
      <PieChart widthAndHeight={widthAndHeight} series={moduleData} />
      <View style={styles.legendContainer}>
        {moduleData.map((module, index) => {
          const percentage = ((module.value / total) * 100).toFixed(1);
          return (
            <Text key={index} style={styles.legend}>
              <Text style={{ color: module.color }}>⬤</Text>{' '}
              {module.label?.text}: {module.value} ({percentage}%)
            </Text>
          );
        })}
        <Text style={[styles.total, { marginTop: 8 }]}>
          {total} Total Defects
        </Text>
        <Text style={styles.common}>
          {moduleData[0].value} Most Common: {moduleData[0].label?.text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  legendContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  legend: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  common: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333',
    textAlign: 'center',
  },
});

export default DefectsByModuleChart;
