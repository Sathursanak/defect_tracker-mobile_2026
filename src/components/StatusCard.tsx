import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import RoundIcon from './RoundIcon';


interface StatusCardProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  desc: string;
  color: string;
  style?: ViewStyle;
}

const StatusCard: React.FC<StatusCardProps> = ({ icon, label, count, desc, color, style }) => (
  <View style={[styles.statusCard, { borderColor: color }, style]}>
    <View style={styles.iconCountRow}>
      <RoundIcon size={32} backgroundColor={color} style={{ borderWidth: 2, borderColor: 'white', marginRight: 4 }}>
        {React.isValidElement(icon) ? React.cloneElement(icon as any, { color: '#fff', size: 18 }) : icon}
      </RoundIcon>
      <Text style={[styles.statusCardCount, { color }]}>{count}</Text>
    </View>
    <Text style={styles.statusCardLabel}>{label}</Text>
    <Text style={styles.statusCardDesc} numberOfLines={2}>{desc}</Text>
  </View>
);

const styles = StyleSheet.create({
  statusCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1.5,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 4,
    minWidth: 100,
    maxWidth: 110,
  },
  iconCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  statusCardLabel: {
    fontSize: 13,
    color: '#60A5FA',
    fontWeight: 'bold',
    marginBottom: 1,
    textAlign: 'center',
  },
  statusCardCount: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  statusCardDesc: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 1,
    color: '#444',
  },
});

export default StatusCard; 