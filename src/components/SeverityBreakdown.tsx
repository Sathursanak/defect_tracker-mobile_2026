import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PieChart from 'react-native-pie-chart';

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

interface SeverityBreakdownProps {
  defectData: {
    high: DefectData;
    medium: DefectData;
    low: DefectData;
  };
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Calculate responsive card width based on screen size
const getCardWidth = () => {
  const availableWidth = SCREEN_WIDTH - 48; // Account for padding and gaps
  const cardWidth = availableWidth / 3;
  return Math.max(cardWidth, 100); // Minimum width of 100
};

const SeverityBreakdown: React.FC<SeverityBreakdownProps> = ({
  defectData,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<
    'high' | 'medium' | 'low'
  >('high');

  const handleViewChart = (severity: 'high' | 'medium' | 'low') => {
    setSelectedSeverity(severity);
    setModalVisible(true);
  };

  const renderPieChart = (data: DefectData) => {
    const total = data.total;
    const segments = [
      { value: data.new, color: '#3b82f6', label: 'NEW' },
      { value: data.fixed, color: '#22c55e', label: 'FIXED' },
      { value: data.closed, color: '#16a34a', label: 'CLOSED' },
      { value: data.open, color: '#eab308', label: 'OPEN' },
      { value: data.reopen, color: '#ef4444', label: 'REOPEN' },
      { value: data.reject, color: '#7f1d1d', label: 'REJECT' },
      { value: data.duplicate, color: '#6b7280', label: 'DUPLICATE' },
    ].filter(segment => segment.value > 0);

    // Prepare data for PieChart component
    const widthAndHeight = 200;
    const series = segments.map(segment => ({
      value: segment.value,
      color: segment.color,
    }));

    return (
      <View style={styles.pieChartContainer}>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Defects</Text>
          <Text style={styles.totalValue}>{total}</Text>
        </View>

        {/* Actual Pie Chart */}
        {total > 0 && (
          <View style={styles.pieChartWrapper}>
            <PieChart
              widthAndHeight={widthAndHeight}
              series={series}
              cover={{ radius: 0.45, color: '#FFF' }}
            />
          </View>
        )}

        {/* Legend */}
        <View style={styles.chartLegend}>
          {segments.map((segment, index) => (
            <View key={index} style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendSquare,
                    { backgroundColor: segment.color },
                  ]}
                />
                <Text style={styles.legendText}>{segment.label}</Text>
              </View>
              <Text style={styles.legendValue}>
                {segment.value} ({((segment.value / total) * 100).toFixed(1)}%)
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const severityConfig = [
    { key: 'high', title: 'High Severity', color: '#c62828' },
    { key: 'medium', title: 'Medium Severity', color: '#f9a825' },
    { key: 'low', title: 'Low Severity', color: '#2ecc40' },
  ];

  return (
    <View>
      <Text style={styles.sectionTitle}>Defect Severity Breakdown</Text>

      <View style={styles.defectCardsContainer}>
        {severityConfig.map(({ key, title, color }) => {
          const data = defectData[key as keyof typeof defectData];
          return (
            <View
              key={key}
              style={[styles.defectCard, { borderTopColor: color }]}
            >
              <View style={styles.cardHeader}>
                <Text
                  style={[styles.defectCardTitle, { color }]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {title}
                </Text>
                <Text style={styles.defectTotal}>{data.total}</Text>
              </View>

              <View style={styles.defectStatsGrid}>
                <View style={styles.statItem}>
                  <View style={[styles.dot, { backgroundColor: '#c62828' }]} />
                  <Text
                    style={styles.statText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    REOPEN
                  </Text>
                  <Text style={styles.statValue}>{data.reopen}</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={[styles.dot, { backgroundColor: '#2ecc40' }]} />
                  <Text
                    style={styles.statText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    CLOSED
                  </Text>
                  <Text style={styles.statValue}>{data.closed}</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={[styles.dot, { backgroundColor: '#f9a825' }]} />
                  <Text
                    style={styles.statText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    NEW
                  </Text>
                  <Text style={styles.statValue}>{data.new}</Text>
                </View>
                <View style={styles.statItem}>
                  <View style={[styles.dot, { backgroundColor: '#3b82f6' }]} />
                  <Text
                    style={styles.statText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    FIXED
                  </Text>
                  <Text style={styles.statValue}>{data.fixed}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.viewChartButton,
                  { backgroundColor: color + '20', borderColor: color },
                ]}
                onPress={() =>
                  handleViewChart(key as 'high' | 'medium' | 'low')
                }
              >
                <Text style={[styles.viewChartText, { color }]}>
                  View Chart
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {severityConfig.find(s => s.key === selectedSeverity)?.title}{' '}
                Chart
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            {renderPieChart(defectData[selectedSeverity])}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  defectCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
    justifyContent: 'space-between',
  },
  defectCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 160,
    maxWidth: getCardWidth(),
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  defectCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 16,
  },
  defectTotal: {
    fontSize: 20,
    color: '#60A5FA',
    fontWeight: 'bold',
  },
  defectStatsGrid: {
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingVertical: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
    flexShrink: 0,
  },
  statText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
    flex: 1,
    textAlign: 'left',
  },
  statValue: {
    fontSize: 11,
    color: '#60A5FA',
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'right',
  },
  viewChartButton: {
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 4,
    minWidth: 80,
  },
  viewChartText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: SCREEN_WIDTH * 0.9,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#60A5FA',
  },
  pieChartContainer: {
    alignItems: 'center',

  },
  pieChart: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  pieCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    position: 'relative',
    backgroundColor: '#f8f9fa',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  svgPie: {
    position: 'absolute',
  },
  chartLegend: {
    width: '100%',
    paddingHorizontal: 20,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendSquare: {
    width: 16,
    height: 12,
    marginRight: 12,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  totalSection: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginHorizontal: 20,
  },
  totalLabel: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 32,
    color: '#60A5FA',
    fontWeight: 'bold',
  },
  pieChartWrapper: {
    alignItems: 'center',
  },
});

export default SeverityBreakdown;
