import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNSpeedometer from 'react-native-speedometer';

interface DefectDensityMeterProps {
  value: number;
  size?: number;
  title?: string;
  unit?: string;
}

const DefectDensityMeter: React.FC<DefectDensityMeterProps> = ({
  value,
  size = 200,
  title = 'Defect Density',
}) => {
  // Define color based on defect density thresholds
  const getColorForValue = (val: number) => {
    if (val < 7) return '#10b981'; // Green for Low (0-7)
    if (val <= 10) return '#f59e0b'; // Yellow for Medium (7-10)
    return '#ef4444'; // Red for High (10+)
  };

  const getCurrentLevel = (val: number) => {
    if (val < 7) return 'Low';
    if (val <= 10) return 'Medium';
    return 'High';
  };

  // Configure speedometer with proper segment distribution
  // We'll use 15 segments to match our 0-15 scale, with proper color distribution
  const maxValue = 15;

  const currentColor = getColorForValue(value);
  const currentLevel = getCurrentLevel(value);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <RNSpeedometer
        value={Math.min(value, maxValue)} // Cap display at maxValue for better visualization
        size={size}
        minValue={0}
        maxValue={maxValue}
        labels={[
          {
            name: 'Low-1',
            labelColor: '#10b981',
            activeBarColor: '#10b981',
          },
          {
            name: 'Low-2',
            labelColor: '#10b981',
            activeBarColor: '#10b981',
          },
          {
            name: 'Low-3',
            labelColor: '#10b981',
            activeBarColor: '#10b981',
          },
          {
            name: 'Low-4',
            labelColor: '#10b981',
            activeBarColor: '#10b981',
          },
          {
            name: 'Low-5',
            labelColor: '#10b981',
            activeBarColor: '#10b981',
          },
          {
            name: 'Low-6',
            labelColor: '#10b981',
            activeBarColor: '#10b981',
          },
          {
            name: 'Low-7',
            labelColor: '#10b981',
            activeBarColor: '#10b981',
          },
          {
            name: 'Medium-1',
            labelColor: '#f59e0b',
            activeBarColor: '#f59e0b',
          },
          {
            name: 'Medium-2',
            labelColor: '#f59e0b',
            activeBarColor: '#f59e0b',
          },
          {
            name: 'Medium-3',
            labelColor: '#f59e0b',
            activeBarColor: '#f59e0b',
          },
          {
            name: 'High-1',
            labelColor: '#ef4444',
            activeBarColor: '#ef4444',
          },
          {
            name: 'High-2',
            labelColor: '#ef4444',
            activeBarColor: '#ef4444',
          },
          {
            name: 'High-3',
            labelColor: '#ef4444',
            activeBarColor: '#ef4444',
          },
          {
            name: 'High-4',
            labelColor: '#ef4444',
            activeBarColor: '#ef4444',
          },
          {
            name: 'High-5',
            labelColor: '#ef4444',
            activeBarColor: '#ef4444',
          },
        ]}
        allowedDecimals={2}
        showLabels={false}
        showPercent={false}
        showIndicator={true}
        showTicks={true}
        tickInterval={1} // Show ticks at every unit for better threshold visibility
        tickLabelStyle={{
          fontSize: 12,
          color: '#374151',
          fontWeight: '600',
        }}
        tickStyle={{
          backgroundColor: '#374151',
          width: 2,
          height: 8,
        }}
        indicatorStyle={{
          backgroundColor: currentColor, // Dynamic color based on value
        }}
        labelStyle={{
          opacity: 0,
        }}
        labelNoteStyle={{
          opacity: 0,
        }}
      />
      <Text style={[styles.valueText, { color: currentColor }]}>
        {value.toFixed(2)}
      </Text>
      <Text style={styles.unitText}>defects/1000 LOC</Text>
      <Text style={[styles.levelText, { color: currentColor }]}>
        {currentLevel} Risk
      </Text>

      <View style={styles.legendContainer}>
        <View
          style={[
            styles.legendItem,
            currentLevel === 'Low' && styles.activeLegendItem,
          ]}
        >
          <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
          <Text
            style={[
              styles.legendText,
              currentLevel === 'Low' && styles.activeLegendText,
            ]}
          >
            Low (0-7)
          </Text>
        </View>
        <View
          style={[
            styles.legendItem,
            currentLevel === 'Medium' && styles.activeLegendItem,
          ]}
        >
          <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
          <Text
            style={[
              styles.legendText,
              currentLevel === 'Medium' && styles.activeLegendText,
            ]}
          >
            Medium (7-10)
          </Text>
        </View>
        <View
          style={[
            styles.legendItem,
            currentLevel === 'High' && styles.activeLegendItem,
          ]}
        >
          <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
          <Text
            style={[
              styles.legendText,
              currentLevel === 'High' && styles.activeLegendText,
            ]}
          >
            High (10+)
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },

  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    textAlign: 'center',
  },
  unitText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'center',
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  legendItem: {
    alignItems: 'center',
    flex: 1,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  legendText: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  activeLegendItem: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 4,
  },
  activeLegendText: {
    fontWeight: 'bold',
    color: '#1f2937',
  },
});

export default DefectDensityMeter;
