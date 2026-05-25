import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface StatusCardProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  desc: string;
  color: string;
  style?: ViewStyle;
  showDivider?: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({
  icon,
  label,
  count,
  desc,
  color,
  style,
  showDivider = false,
}) => (
  <View
    accessibilityRole="text"
    accessibilityLabel={`${label}, ${count}`}
    style={[styles.statCell, showDivider && styles.statCellDivider, style]}
  >
    <Text style={[styles.count, { color }]}>{count}</Text>
    <View style={styles.labelRow}>
      {React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement<{ color?: string; size?: number }>, {
            color,
            size: 14,
          })
        : icon}
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </View>
    <Text style={styles.desc} numberOfLines={1}>
      {desc}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  statCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 4,
    minWidth: 0,
  },
  statCellDivider: {
    borderRightWidth: 1,
    borderRightColor: '#DBEAFE',
  },
  count: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    marginBottom: 2,
    paddingHorizontal: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
  },
  desc: {
    fontSize: 9,
    fontWeight: '500',
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default StatusCard;
