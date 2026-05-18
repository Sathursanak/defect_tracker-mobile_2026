import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  mockNotifications,
  getUnreadNotificationCount,
  getRecentNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  Notification,
} from '../data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface NotificationBellProps {
  iconColor?: string;
  onPress?: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  iconColor = '#60A5FA',
  onPress,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = getUnreadNotificationCount();
  const recentNotifications = getRecentNotifications();

  const handleNotificationPress = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    setNotifications([...mockNotifications]); // Trigger re-render
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    setNotifications([...mockNotifications]); // Trigger re-render
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <Ionicons name="alert-circle" size={20} color="#ef4444" />;
      case 'warning':
        return <Ionicons name="warning" size={20} color="#f59e0b" />;
      case 'success':
        return <Ionicons name="checkmark-circle" size={20} color="#10b981" />;
      case 'info':
      default:
        return <Ionicons name="information-circle" size={20} color="#3b82f6" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.bellContainer}
        onPress={handleNotificationPress}
        activeOpacity={0.7}
      >
        <Ionicons name="notifications-outline" size={24} color={iconColor} />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <View style={styles.headerActions}>
                {unreadCount > 0 && (
                  <TouchableOpacity
                    onPress={handleMarkAllAsRead}
                    style={styles.markAllButton}
                  >
                    <Text style={styles.markAllText}>Mark all read</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={handleCloseModal}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={styles.notificationsList}>
              {recentNotifications.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="notifications-off"
                    size={48}
                    color="#9ca3af"
                  />
                  <Text style={styles.emptyText}>No notifications</Text>
                </View>
              ) : (
                recentNotifications.map(notification => (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.notificationItem,
                      !notification.read && styles.unreadNotification,
                    ]}
                    onPress={() => handleMarkAsRead(notification.id)}
                  >
                    <View style={styles.notificationIcon}>
                      {getNotificationIcon(notification.type)}
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTitle}>
                        {notification.title}
                      </Text>
                      <Text style={styles.notificationMessage}>
                        {notification.message}
                      </Text>
                      <Text style={styles.notificationTime}>
                        {formatTimestamp(notification.timestamp)}
                      </Text>
                    </View>
                    {!notification.read && <View style={styles.unreadDot} />}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  bellContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  markAllButton: {
    marginRight: 16,
  },
  markAllText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    padding: 4,
  },
  notificationsList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
    marginTop: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    alignItems: 'flex-start',
  },
  unreadNotification: {
    backgroundColor: '#f0f9ff',
  },
  notificationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginTop: 8,
    marginLeft: 8,
  },
});

export default NotificationBell;
