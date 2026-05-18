import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';

interface DataPoint {
  x: string;
  y: number;
}

interface LineChartProps {
  data: DataPoint[];
  title?: string;
  color?: string;
  width?: number;
  height?: number;
  yAxisLabel?: string;
  showTitle?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  color = '#3b82f6',
  width = Dimensions.get('window').width - 60,
  height = 200,
  yAxisLabel = 'Count',
  showTitle = false,
}) => {
  const leftPadding = 60; // More space for y-axis labels
  const rightPadding = 20;
  const topPadding = 20;
  const bottomPadding = 40;
  const chartWidth = width - leftPadding - rightPadding;
  const chartHeight = height - topPadding - bottomPadding;

  // Find min and max values for scaling
  const yValues = data.map(d => d.y);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const yRange = maxY - minY || 1;

  // Create points for the line
  const points = data.map((point, index) => {
    const x = leftPadding + (index / (data.length - 1)) * chartWidth;
    const y =
      topPadding + chartHeight - ((point.y - minY) / yRange) * chartHeight;
    return { x, y, label: point.x, value: point.y };
  });

  // Create path string for the line
  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  // Generate grid lines
  const gridLines = [];
  const numGridLines = 5;
  for (let i = 0; i <= numGridLines; i++) {
    const y = topPadding + (i / numGridLines) * chartHeight;
    const value = maxY - (i / numGridLines) * yRange;
    gridLines.push({ y, value: Math.round(value * 10) / 10 });
  }

  return (
    <View style={styles.container}>
      {showTitle && title && <Text style={styles.title}>{title}</Text>}

      <Svg width={width} height={height}>
        {/* Grid lines */}
        {gridLines.map((line, index) => (
          <React.Fragment key={index}>
            <Line
              x1={leftPadding}
              y1={line.y}
              x2={width - rightPadding}
              y2={line.y}
              stroke="#e5e7eb"
              strokeWidth={1}
              strokeDasharray="3,3"
            />
            <SvgText
              x={leftPadding - 10}
              y={line.y + 4}
              fontSize="12"
              fill="#6b7280"
              textAnchor="end"
            >
              {line.value}
            </SvgText>
          </React.Fragment>
        ))}

        {/* X-axis */}
        <Line
          x1={leftPadding}
          y1={height - bottomPadding}
          x2={width - rightPadding}
          y2={height - bottomPadding}
          stroke="#374151"
          strokeWidth={2}
        />

        {/* Y-axis */}
        <Line
          x1={leftPadding}
          y1={topPadding}
          x2={leftPadding}
          y2={height - bottomPadding}
          stroke="#374151"
          strokeWidth={2}
        />

        {/* Data line */}
        <Path
          d={pathData}
          stroke={color}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={color}
            stroke="#ffffff"
            strokeWidth={2}
          />
        ))}

        {/* X-axis labels */}
        {points.map((point, index) => (
          <SvgText
            key={index}
            x={point.x}
            y={height - bottomPadding + 15}
            fontSize="10"
            fill="#6b7280"
            textAnchor="middle"
          >
            {point.label}
          </SvgText>
        ))}
      </Svg>

      {/* Y-axis label */}
      {yAxisLabel && <Text style={styles.yAxisLabel}>{yAxisLabel}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
    position: 'relative',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  yAxisLabel: {
    position: 'absolute',
    left: -25,
    top: '50%',
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    transform: [{ rotate: '-90deg' }],
  },
});

export default LineChart;
