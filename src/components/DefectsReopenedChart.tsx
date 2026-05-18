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

interface DefectsReopenedChartProps {
  defectData: {
    high: DefectData;
    medium: DefectData;
    low: DefectData;
  };
}

const DefectsReopenedChart: React.FC<DefectsReopenedChartProps> = ({
  defectData,
}) => {
  const widthAndHeight = 220;

  // Use centralized defect breakdown calculation
  const breakdown = getDefectBreakdown(defectData);
  const totalReopened = breakdown.reopened;
  const totalOther = breakdown.totalDefects - totalReopened;

  const reopenedSeries = [
    {
      value: totalReopened,
      color: '#4285F4',
      label: { text: 'Reopened', fontSize: 12 },
    },
    {
      value: totalOther,
      color: '#fbbc05',
      label: { text: 'Other', fontSize: 12 },
    },
  ].filter(item => item.value > 0);

  return (
    <View style={styles.container}>
      <PieChart widthAndHeight={widthAndHeight} series={reopenedSeries} />
      <View style={styles.legendContainer}>
        {reopenedSeries.map((item, index) => {
          const total = reopenedSeries.reduce((sum, s) => sum + s.value, 0);
          const percentage =
            total > 0 ? ((item.value / total) * 100).toFixed(1) : '0.0';
          return (
            <Text key={index} style={styles.legend}>
              <Text style={{ color: item.color }}>⬤</Text> {item.label?.text}:{' '}
              {item.value} ({percentage}%)
            </Text>
          );
        })}
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
});

export default DefectsReopenedChart;
