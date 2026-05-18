import React from 'react';
import LineChart from './LineChart';
import { calculateTotalDefects } from '../data/mockData';

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

interface TimeToFindChartProps {
  defectData: {
    high: DefectData;
    medium: DefectData;
    low: DefectData;
  };
}

const TimeToFindChart: React.FC<TimeToFindChartProps> = ({ defectData }) => {
  // Generate time-based data based on actual defect counts
  const totalDefects = calculateTotalDefects(defectData);
  const avgPerDay = Math.max(1, Math.floor(totalDefects / 10));

  const timeToFindData = Array.from({ length: 10 }, (_, index) => ({
    x: `Day ${index + 1}`,
    y: Math.max(1, avgPerDay + Math.floor(Math.random() * 3) - 1), // Add some variation
  }));

  return (
    <LineChart
      data={timeToFindData}
      color="#3b82f6"
      yAxisLabel="Defects Found"
      showTitle={false}
    />
  );
};

export default TimeToFindChart;
