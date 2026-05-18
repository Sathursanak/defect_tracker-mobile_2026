import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

interface SeverityIndexIndicatorProps {
  value: number; // Value between 0-3 (will be converted to 0-100 scale)
  size?: number;
  title?: string;
}

const SeverityIndexIndicator: React.FC<SeverityIndexIndicatorProps> = ({
  value,
  size = 200,
  title = 'Defect Severity Index',
}) => {
  // Convert severity index (0-3) to percentage (0-100)
  const percentage = Math.min(Math.max((value / 3) * 100, 0), 100);
  const displayValue = Math.round(percentage);

  // SVG dimensions
  const radius = size / 2 - 20;
  const centerX = size / 2;
  const centerY = size / 2;
  const strokeWidth = 8;

  // Calculate arc path for the gauge background (full circle)
  const startAngle = -90; // Start from top (12 o'clock position)
  const endAngle = 270; // End at top (complete 360° circle)
  const angleRange = 360; // Full circle

  // Calculate the current value angle
  const valueAngle = startAngle + (percentage / 100) * angleRange;

  // Create arc path
  const createArcPath = (
    startAngleParam: number,
    endAngleParam: number,
    radiusParam: number,
  ) => {
    // Handle full circle (360°) case
    const angleDiff = endAngleParam - startAngleParam;
    if (angleDiff >= 360) {
      // Create a full circle using two semicircles
      const topX = centerX;
      const topY = centerY - radiusParam;
      const bottomX = centerX;
      const bottomY = centerY + radiusParam;

      return `M ${topX} ${topY} A ${radiusParam} ${radiusParam} 0 0 1 ${bottomX} ${bottomY} A ${radiusParam} ${radiusParam} 0 0 1 ${topX} ${topY}`;
    }

    const startX =
      centerX + radiusParam * Math.cos((startAngleParam * Math.PI) / 180);
    const startY =
      centerY + radiusParam * Math.sin((startAngleParam * Math.PI) / 180);
    const endX =
      centerX + radiusParam * Math.cos((endAngleParam * Math.PI) / 180);
    const endY =
      centerY + radiusParam * Math.sin((endAngleParam * Math.PI) / 180);

    const largeArcFlag = angleDiff <= 180 ? '0' : '1';

    return `M ${startX} ${startY} A ${radiusParam} ${radiusParam} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  // Background arc (full gauge)
  const backgroundPath = createArcPath(startAngle, endAngle, radius);

  // Value arc (filled portion)
  const valuePath = createArcPath(startAngle, valueAngle, radius);

  // Scale markers
  const scaleMarkers = [0, 25, 50, 75, 100];

  // Get color based on severity level
  const getColor = (severityPercentage: number) => {
    if (severityPercentage <= 33) return '#10b981'; // Green for low severity
    if (severityPercentage <= 66) return '#f59e0b'; // Yellow for medium severity
    return '#ef4444'; // Red for high severity
  };

  const indicatorColor = getColor(percentage);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={[styles.gaugeContainer, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background arc */}
          <Path
            d={backgroundPath}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />

          {/* Value arc */}
          <Path
            d={valuePath}
            stroke={indicatorColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />

          {/* Scale markers */}
          {scaleMarkers.map((marker, index) => {
            const markerAngle = startAngle + (marker / 100) * angleRange;
            const markerRad = (markerAngle * Math.PI) / 180;
            const innerRadius = radius - 15;
            const outerRadius = radius - 5;

            const x1 = centerX + innerRadius * Math.cos(markerRad);
            const y1 = centerY + innerRadius * Math.sin(markerRad);
            const x2 = centerX + outerRadius * Math.cos(markerRad);
            const y2 = centerY + outerRadius * Math.sin(markerRad);

            return (
              <Path
                key={index}
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                stroke="#9ca3af"
                strokeWidth={2}
                strokeLinecap="round"
              />
            );
          })}

          {/* Scale labels */}
          {scaleMarkers.map((marker, index) => {
            const markerAngle = startAngle + (marker / 100) * angleRange;
            const markerRad = (markerAngle * Math.PI) / 180;
            const labelRadius = radius - 25;

            const x = centerX + labelRadius * Math.cos(markerRad);
            const y = centerY + labelRadius * Math.sin(markerRad);

            return (
              <SvgText
                key={`label-${index}`}
                x={x}
                y={y + 4}
                fontSize="12"
                fill="#6b7280"
                textAnchor="middle"
                fontWeight="500"
              >
                {marker}
              </SvgText>
            );
          })}
        </Svg>

        {/* Number display inside the round */}
        <View style={styles.numberContainer}>
          <Text style={[styles.valueText, { color: indicatorColor }]}>
            {displayValue}
          </Text>
        </View>
      </View>

      {/* Description text below the round */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.valueLabel}>
          Weighted severity score (higher = more severe defects)
        </Text>
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
  gaugeContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  valueContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  valueText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  valueLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default SeverityIndexIndicator;
