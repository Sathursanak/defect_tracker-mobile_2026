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

interface DefectDistributionChartProps {
  defectData: {
    high: DefectData;
    medium: DefectData;
    low: DefectData;
  };
}

const DefectDistributionChart: React.FC<DefectDistributionChartProps> = ({
  defectData,
}) => {
  const widthAndHeight = 220;

  // Use centralized defect breakdown calculation
  const breakdown = getDefectBreakdown(defectData);

  const typeSeries = [
    {
      value: breakdown.functionality,
      color: '#4285F4',
      label: { text: 'Functionality', fontSize: 10 },
    },
    {
      value: breakdown.ui,
      color: '#00bfae',
      label: { text: 'UI', fontSize: 10 },
    },
    {
      value: breakdown.usability,
      color: '#fbbc05',
      label: { text: 'Usability', fontSize: 10 },
    },
    {
      value: breakdown.validation,
      color: '#ea4335',
      label: { text: 'Validation', fontSize: 10 },
    },
  ].filter(item => item.value > 0);

  return (
    <View style={styles.container}>
      <PieChart widthAndHeight={widthAndHeight} series={typeSeries} />
      <View style={styles.legendContainer}>
        {typeSeries.map((item, index) => {
          const total = typeSeries.reduce((sum, s) => sum + s.value, 0);
          const percentage =
            total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';
          return (
            <Text key={index} style={styles.legend}>
              <Text style={{ color: item.color }}>⬤</Text> {item.label?.text}:{' '}
              {item.value} ({percentage}%)
            </Text>
          );
        })}
        <Text style={[styles.total, { marginTop: 8 }]}>
          {breakdown.totalDefects} Total Defects
        </Text>
        {typeSeries.length > 0 && (
          <Text style={styles.common}>
            {Math.max(...typeSeries.map(s => s.value))} Most Common:{' '}
            {
              typeSeries.find(
                s =>
                  s.value === Math.max(...typeSeries.map(item => item.value)),
              )?.label?.text
            }
          </Text>
        )}
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

export default DefectDistributionChart;
