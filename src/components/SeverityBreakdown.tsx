import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PieChart from 'react-native-pie-chart';

interface SeverityBreakdownProps {
  defectData: Record<string, Record<string, number>>;
  onScrollDown?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Calculate responsive card width based on screen size
const getCardWidth = () => {
  const availableWidth = SCREEN_WIDTH - 48; // Account for padding and gaps
  const cardWidth = availableWidth / 3;
  return Math.max(cardWidth, 100); // Minimum width of 100
};

const SeverityBreakdown: React.FC<SeverityBreakdownProps> = ({
  defectData = {},
  onScrollDown,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('');

  // Scroll Position Tracking for Arrows
  const horizontalScrollRef = useRef<ScrollView>(null);
  const [currentScrollX, setCurrentScrollX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  // Micro-Animations
  const animX = useRef(new Animated.Value(-8)).current;
  const animY = useRef(new Animated.Value(-6)).current;

  useEffect(() => {
    // Horizontal Swiping Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animX, {
          toValue: 8,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animX, {
          toValue: -8,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ).start();

    // Vertical Bouncing Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animY, {
          toValue: 6,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animY, {
          toValue: -6,
          duration: 800,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const scrollLeft = () => {
    const newX = Math.max(0, currentScrollX - 162);
    horizontalScrollRef.current?.scrollTo({ x: newX, animated: true });
    setCurrentScrollX(newX);
  };

  const scrollRight = () => {
    const newX = Math.min(contentWidth - SCREEN_WIDTH, currentScrollX + 162);
    horizontalScrollRef.current?.scrollTo({ x: newX, animated: true });
    setCurrentScrollX(newX);
  };

  const handleScroll = (event: any) => {
    setCurrentScrollX(event.nativeEvent.contentOffset.x);
  };

  const countRemarks = (data: Record<string, Record<string, number>>) =>
    Object.values(data).reduce((severitySum, severityData) => {
      return Object.entries(severityData).reduce((statusSum, [status, value]) => {
        return status.toLowerCase() === 'total' ? statusSum : statusSum + value;
      }, severitySum);
    }, 0);

  const countDuplicateReject = (data: Record<string, Record<string, number>>) =>
    Object.values(data).reduce((sum, severityData) => {
      return (
        sum +
        (severityData.duplicate ?? 0) +
        (severityData.reject ?? 0) +
        (severityData.rejected ?? 0)
      );
    }, 0);

  const totalRemarks = countRemarks(defectData);
  const duplicateRejectCount = countDuplicateReject(defectData);
  const totalDefects = Math.max(totalRemarks - duplicateRejectCount, 0);

  const STATUS_COLORS: Record<string, string> = {
    new: '#3b82f6',
    open: '#f59e0b',
    'in progress': '#8b5cf6',
    reopen: '#ef4444',
    reopened: '#ef4444',
    fixed: '#22c55e',
    closed: '#16a34a',
    duplicate: '#6b7280',
    reject: '#7f1d1d',
    rejected: '#7f1d1d',
    hold: '#f97316',
    ne: '#111827',
  };

  const handleViewChart = (severity: string) => {
    setSelectedSeverity(severity);
    setModalVisible(true);
  };

  const renderPieChart = (data: Record<string, number>) => {
    const entries = Object.entries(data).filter(
      ([key]) => key.toLowerCase() !== 'total',
    );
    const total = data.total ?? entries.reduce((sum, [, value]) => sum + value, 0);

    const statusOrder = [
      'new',
      'open',
      'in progress',
      'reopen',
      'reopened',
      'fixed',
      'closed',
      'duplicate',
      'reject',
      'rejected',
      'hold',
      'ne',
    ];

    const segments = entries
      .map(([status, value]) => ({
        value,
        color: STATUS_COLORS[status.toLowerCase()] || '#3b82f6',
        label: status.toUpperCase(),
        key: status,
      }))
      .filter(segment => segment.value > 0)
      .sort((a, b) => {
        const aIndex = statusOrder.indexOf(a.key.toLowerCase());
        const bIndex = statusOrder.indexOf(b.key.toLowerCase());
        return (
          (aIndex === -1 ? statusOrder.length : aIndex) -
          (bIndex === -1 ? statusOrder.length : bIndex)
        );
      });

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

        {total > 0 && (
          <View style={styles.pieChartWrapper}>
            <PieChart
              widthAndHeight={widthAndHeight}
              series={series}
              cover={{ radius: 0.45, color: '#FFF' }}
            />
          </View>
        )}

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

  const severityConfig = Object.keys(defectData)
    .filter(key => key.toLowerCase() !== 'total')
    .map(key => ({
      key,
      title: `${key.charAt(0).toUpperCase()}${key.slice(1)} Severity`,
      color:
        key.toLowerCase() === 'high'
          ? '#c62828'
          : key.toLowerCase() === 'medium'
            ? '#f9a825'
            : key.toLowerCase() === 'low'
              ? '#2ecc40'
              : '#3b82f6',
    }));

  return (
    <View>
      <Text style={styles.sectionTitle}>Defect Severity Breakdown</Text>

      {/* Remarks/Defects counts summary cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryBadge, styles.remarkBadge]}>
          <View style={styles.summaryHeader}>
            <View style={[styles.summaryPill, styles.remarkPill]}>
              <Ionicons name="reader-outline" size={20} color="#2563eb" />
            </View>
            <Text style={styles.summaryLabel}>Total Remarks</Text>
          </View>
          <Text style={styles.summaryValue}>{totalRemarks}</Text>
        </View>
        <View style={[styles.summaryBadge, styles.defectBadge]}>
          <View style={styles.summaryHeader}>
            <View style={[styles.summaryPill, styles.defectPill]}>
              <Ionicons name="bug-outline" size={20} color="#b91c1c" />
            </View>
            <Text style={styles.summaryLabel}>Total Defects</Text>
          </View>
          <Text style={styles.summaryValue}>{totalDefects}</Text>
        </View>
      </View>

      {/* Swipeable cards with left & right click controllers */}
      <View style={styles.carouselContainer}>
        {currentScrollX > 10 && (
          <TouchableOpacity
            style={[styles.arrowButton, styles.leftArrow]}
            activeOpacity={0.85}
            onPress={scrollLeft}
          >
            <Ionicons name="chevron-back" size={20} color="#4b5563" />
          </TouchableOpacity>
        )}

        <ScrollView
          ref={horizontalScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onContentSizeChange={(w) => setContentWidth(w)}
          contentContainerStyle={styles.defectCardsContainer}
        >
          {severityConfig.map(({ key, title, color }) => {
            const data = defectData[key];
            const statusEntries = data
              ? Object.entries(data).filter(
                ([status]) => status.toLowerCase() !== 'total',
              )
              : [];
            const total = data
              ? data.total ?? statusEntries.reduce((sum, [, value]) => sum + value, 0)
              : 0;

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
                  <Text style={styles.defectTotal}>{total}</Text>
                </View>

                <View style={styles.defectStatsGrid}>
                  {statusEntries.length === 0 ? (
                    <Text style={styles.noStatusText}>No status data available</Text>
                  ) : (
                    statusEntries.map(([status, value], idx) => (
                      <View key={idx} style={styles.statItem}>
                        <View
                          style={[
                            styles.dot,
                            {
                              backgroundColor:
                                STATUS_COLORS[status.toLowerCase()] || '#3b82f6',
                            },
                          ]}
                        />
                        <Text
                          style={styles.statText}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {status.toUpperCase()}
                        </Text>
                        <Text style={styles.statValue}>{value}</Text>
                      </View>
                    ))
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.viewChartButton,
                    { backgroundColor: color + '20', borderColor: color },
                  ]}
                  onPress={() => handleViewChart(key)}
                >
                  <Text style={[styles.viewChartText, { color }]}>
                    View Chart
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>

        {currentScrollX < contentWidth - SCREEN_WIDTH + 8 && (
          <TouchableOpacity
            style={[styles.arrowButton, styles.rightArrow]}
            activeOpacity={0.85}
            onPress={scrollRight}
          >
            <Ionicons name="chevron-forward" size={20} color="#4b5563" />
          </TouchableOpacity>
        )}
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
                {severityConfig.find(s => s.key === selectedSeverity)?.title || 'Severity'} Chart
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            {defectData[selectedSeverity] ? (
              renderPieChart(defectData[selectedSeverity])
            ) : (
              <Text style={styles.noStatusText}>
                No chart data available for this category.
              </Text>
            )}
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
  carouselContainer: {
    position: 'relative',
    justifyContent: 'center',
    width: '100%',
  },
  arrowButton: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.82)', // Translucent glassmorphism so text underneath is fully visible!
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    borderWidth: 1.5,
    borderColor: 'rgba(219, 234, 254, 0.9)', // Light blue translucent outline
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    top: '38%',
  },
  leftArrow: {
    left: 2,
  },
  rightArrow: {
    right: 2,
  },
  defectCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  defectCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderTopWidth: 3,
    marginBottom: 12,
    marginRight: 8,
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
    color: '#3b82f6',
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
    color: '#3b82f6',
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
    color: '#3b82f6',
  },
  pieChartContainer: {
    alignItems: 'center',
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
  noStatusText: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 32,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  pieChartWrapper: {
    alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  summaryBadge: {
    flex: 0.48,
    minHeight: 56,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  remarkBadge: {
    borderLeftWidth: 4,
    borderColor: '#3b82f6',
  },
  defectBadge: {
    borderLeftWidth: 4,
    borderColor: '#ef4444',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 6,
  },
  summaryPill: {
    width: 26,
    height: 26,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  remarkPill: {
    backgroundColor: '#dbeafe',
  },
  defectPill: {
    backgroundColor: '#fee2e2',
  },
  summaryLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '700',
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    width: '100%',
  },
});

export default SeverityBreakdown;
