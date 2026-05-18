import React from 'react';
import LineChart from './LineChart';
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

interface TimeToFixChartProps {
  defectData: {
    high: DefectData;
    medium: DefectData;
    low: DefectData;
  };
}

const TimeToFixChart: React.FC<TimeToFixChartProps> = ({ defectData }) => {
  // Generate time-based data based on actual fixed defects
  const breakdown = getDefectBreakdown(defectData);
  const totalFixed = breakdown.fixed;
  const avgPerDay = Math.max(1, Math.floor(totalFixed / 10));

  const timeToFixData = Array.from({ length: 10 }, (_, index) => ({
    x: `Day ${index + 1}`,
    y: Math.max(1, avgPerDay + Math.floor(Math.random() * 2) - 1), // Add some variation
  }));

  return (
    <LineChart
      data={timeToFixData}
      color="#10b981"
      yAxisLabel="Defects Fixed"
      showTitle={false}
    />
  );
};

export default TimeToFixChart;
