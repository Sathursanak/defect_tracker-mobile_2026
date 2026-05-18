import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock user data - in a real app, this would come from your auth/user context
const mockUserData = {
  name: 'John Doe',
  email: 'john.doe@company.com',
  role: 'Senior QA Engineer',
  department: 'Quality Assurance',
  joinDate: 'January 2022',
  projectsAssigned: 5,
  defectsReported: 127,
  defectsResolved: 98,
};

interface ProfileProps {
  iconColor?: string;
}

const Profile: React.FC<ProfileProps> = ({ iconColor = '#60A5FA' }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleProfilePress = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            setIsModalVisible(false);
            // Navigate back to Welcome screen (which will reset the navigation stack)
            (navigation as any).reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile screen
    Alert.alert('Edit Profile', 'Edit profile functionality coming soon!');
  };

  const handleChangePassword = () => {
    // TODO: Navigate to change password screen
    Alert.alert(
      'Change Password',
      'Change password functionality coming soon!',
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.profileContainer}
        onPress={handleProfilePress}
        activeOpacity={0.7}
      >
        <Ionicons name="person-outline" size={24} color={iconColor} />
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
              <Text style={styles.modalTitle}>Profile</Text>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.profileContent}>
              {/* Profile Avatar */}
              <View style={styles.avatarSection}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={40} color="#ffffff" />
                </View>
                <Text style={styles.userName}>{mockUserData.name}</Text>
                <Text style={styles.userRole}>{mockUserData.role}</Text>
              </View>

              {/* Profile Details */}
              <View style={styles.detailsSection}>
                <View style={styles.detailItem}>
                  <Ionicons name="mail-outline" size={20} color="#6b7280" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Email</Text>
                    <Text style={styles.detailValue}>{mockUserData.email}</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <Ionicons name="business-outline" size={20} color="#6b7280" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Department</Text>
                    <Text style={styles.detailValue}>
                      {mockUserData.department}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Joined</Text>
                    <Text style={styles.detailValue}>
                      {mockUserData.joinDate}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Stats Section */}
              <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Statistics</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                      {mockUserData.projectsAssigned}
                    </Text>
                    <Text style={styles.statLabel}>Projects</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                      {mockUserData.defectsReported}
                    </Text>
                    <Text style={styles.statLabel}>Reported</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                      {mockUserData.defectsResolved}
                    </Text>
                    <Text style={styles.statLabel}>Resolved</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsSection}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleEditProfile}
                >
                  <Ionicons name="create-outline" size={20} color="#3b82f6" />
                  <Text style={styles.actionButtonText}>Edit Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleChangePassword}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#3b82f6"
                  />
                  <Text style={styles.actionButtonText}>Change Password</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.logoutButton]}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                  <Text
                    style={[styles.actionButtonText, styles.logoutButtonText]}
                  >
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
    maxHeight: '85%',
    minHeight: '60%',
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
  closeButton: {
    padding: 4,
  },
  profileContent: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#60A5FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#6b7280',
  },
  detailsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  statsSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#60A5FA',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionsSection: {
    padding: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#fef2f2',
  },
  logoutButtonText: {
    color: '#ef4444',
  },
});

export default Profile;
