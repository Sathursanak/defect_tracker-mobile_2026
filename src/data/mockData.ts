// Mock data to be used across all pages
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: Date;
  read: boolean;
}

export interface DefectData {
  total: number;
  reopen: number;
  closed: number;
  new: number;
  reject: number;
  open: number;
  duplicate: number;
  fixed: number;
}

export interface ProjectData {
  name: string;
  risk: 'high' | 'medium' | 'low';
  defectData: {
    high: DefectData;
    medium: DefectData;
    low: DefectData;
  };
}

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'High Priority Defect',
    message: 'Critical bug found in authentication module',
    type: 'error',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
  },
  {
    id: '2',
    title: 'Defect Fixed',
    message: 'UI alignment issue has been resolved',
    type: 'success',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false,
  },
  {
    id: '3',
    title: 'Code Review Required',
    message: 'New defect fixes need review in Dashboard module',
    type: 'warning',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
  },
  {
    id: '4',
    title: 'Weekly Report',
    message: 'Defect tracking report is ready for download',
    type: 'info',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
  },
  {
    id: '5',
    title: 'System Maintenance',
    message: 'Scheduled maintenance tonight at 2 AM',
    type: 'warning',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
  },
];

// Mock project data
export const mockProjects: ProjectData[] = [
  {
    name: 'Defect Tracker',
    risk: 'high',
    defectData: {
      high: { total: 15, reopen: 3, closed: 8, new: 4, reject: 1, open: 6, duplicate: 2, fixed: 7 },
      medium: { total: 25, reopen: 5, closed: 15, new: 5, reject: 2, open: 8, duplicate: 3, fixed: 12 },
      low: { total: 35, reopen: 2, closed: 28, new: 5, reject: 1, open: 6, duplicate: 1, fixed: 27 },
    },
  },
  {
    name: 'QA testing',
    risk: 'medium',
    defectData: {
      high: { total: 8, reopen: 1, closed: 5, new: 2, reject: 0, open: 3, duplicate: 1, fixed: 4 },
      medium: { total: 18, reopen: 3, closed: 12, new: 3, reject: 1, open: 5, duplicate: 2, fixed: 10 },
      low: { total: 22, reopen: 1, closed: 18, new: 3, reject: 0, open: 4, duplicate: 0, fixed: 18 },
    },
  },
  {
    name: 'API Integration',
    risk: 'low',
    defectData: {
      high: { total: 3, reopen: 0, closed: 2, new: 1, reject: 0, open: 1, duplicate: 0, fixed: 2 },
      medium: { total: 12, reopen: 1, closed: 9, new: 2, reject: 0, open: 3, duplicate: 1, fixed: 8 },
      low: { total: 18, reopen: 0, closed: 16, new: 2, reject: 0, open: 2, duplicate: 0, fixed: 16 },
    },
  },
  {
    name: 'Database Migration',
    risk: 'high',
    defectData: {
      high: { total: 12, reopen: 2, closed: 7, new: 3, reject: 1, open: 4, duplicate: 1, fixed: 6 },
      medium: { total: 20, reopen: 4, closed: 12, new: 4, reject: 1, open: 7, duplicate: 2, fixed: 10 },
      low: { total: 28, reopen: 1, closed: 24, new: 3, reject: 0, open: 4, duplicate: 1, fixed: 23 },
    },
  },
  {
    name: 'project 1',
    risk: 'medium',
    defectData: {
      high: { total: 6, reopen: 1, closed: 4, new: 1, reject: 0, open: 2, duplicate: 0, fixed: 4 },
      medium: { total: 14, reopen: 2, closed: 10, new: 2, reject: 1, open: 3, duplicate: 1, fixed: 9 },
      low: { total: 20, reopen: 0, closed: 17, new: 3, reject: 0, open: 3, duplicate: 0, fixed: 17 },
    },
  },
];

// Helper functions
export const getProjectData = (projectName: string): ProjectData | undefined => {
  return mockProjects.find(project => project.name === projectName);
};

export const getUnreadNotificationCount = (): number => {
  return mockNotifications.filter(notification => !notification.read).length;
};

export const getRecentNotifications = (limit: number = 5): Notification[] => {
  return mockNotifications
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
};

export const markNotificationAsRead = (notificationId: string): void => {
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
  }
};

export const markAllNotificationsAsRead = (): void => {
  mockNotifications.forEach(notification => {
    notification.read = true;
  });
};

// Chart data interfaces
export interface ChartDataPoint {
  x: string;
  y: number;
}

export interface PieSlice {
  value: number;
  color: string;
  label?: {
    text: string;
    fontSize?: number;
    offsetX?: number;
    offsetY?: number;
    fontWeight?: 'bold' | 'normal';
    fontStyle?: 'italic' | 'normal';
    outline?: string;
  };
}

// Mock chart data
export const timeToFindData: ChartDataPoint[] = [
  { x: 'Day 1', y: 2 },
  { x: 'Day 2', y: 3 },
  { x: 'Day 3', y: 1 },
  { x: 'Day 4', y: 4 },
  { x: 'Day 5', y: 2 },
  { x: 'Day 6', y: 3 },
  { x: 'Day 7', y: 2 },
  { x: 'Day 8', y: 1 },
  { x: 'Day 9', y: 2 },
  { x: 'Day 10', y: 1 },
];

export const timeToFixData: ChartDataPoint[] = [
  { x: 'Day 1', y: 3 },
  { x: 'Day 2', y: 2 },
  { x: 'Day 3', y: 4 },
  { x: 'Day 4', y: 3 },
  { x: 'Day 5', y: 2 },
  { x: 'Day 6', y: 3 },
  { x: 'Day 7', y: 2 },
  { x: 'Day 8', y: 1 },
  { x: 'Day 9', y: 2 },
  { x: 'Day 10', y: 2 },
];

export const defectsByModuleData: PieSlice[] = [
  { value: 30, color: '#3b82f6', label: { text: 'Auth', fontSize: 10 } },
  { value: 25, color: '#10b981', label: { text: 'Dashboard', fontSize: 10 } },
  { value: 20, color: '#f59e0b', label: { text: 'Reports', fontSize: 10 } },
  { value: 15, color: '#ef4444', label: { text: 'Settings', fontSize: 10 } },
  { value: 10, color: '#8b5cf6', label: { text: 'API', fontSize: 10 } },
];

export const defectsReopenedData: PieSlice[] = [
  { value: 5, color: '#4285F4', label: { text: '2 times', fontSize: 12 } },
  { value: 1, color: '#fbbc05', label: { text: '4 times', fontSize: 12, offsetY: 10 } },
];

export const defectDistributionData: PieSlice[] = [
  { value: 245, color: '#4285F4', label: { text: 'Functionality', fontSize: 10 } },
  { value: 81, color: '#00bfae', label: { text: 'UI', fontSize: 10 } },
  { value: 30, color: '#fbbc05', label: { text: 'Usability', fontSize: 10 } },
  { value: 103, color: '#ea4335', label: { text: 'Validation', fontSize: 10 } },
];

// Other mock metrics
export const mockMetrics = {
  totalRemarks: 45,
  linesOfCode: 15000,
  avgTimeToFind: 24.5,
  avgTimeToFix: 18.2,
};

// Helper function to calculate total defects consistently
export const calculateTotalDefects = (defectData: {
  high: DefectData;
  medium: DefectData;
  low: DefectData;
}): number => {
  return defectData.high.total + defectData.medium.total + defectData.low.total;
};

// Helper function to get defect breakdown for charts
export const getDefectBreakdown = (defectData: {
  high: DefectData;
  medium: DefectData;
  low: DefectData;
}) => {
  const totalDefects = calculateTotalDefects(defectData);

  // Calculate proportional distribution based on total defects
  // Using the severity distribution as the base
  const highProportion = defectData.high.total / totalDefects;
  const mediumProportion = defectData.medium.total / totalDefects;
  const lowProportion = defectData.low.total / totalDefects;

  return {
    totalDefects,
    highProportion,
    mediumProportion,
    lowProportion,
    // For charts, we'll use proportional distribution
    functionality: Math.round(totalDefects * 0.4), // 40% functionality issues
    ui: Math.round(totalDefects * 0.25), // 25% UI issues
    usability: Math.round(totalDefects * 0.15), // 15% usability issues
    validation: Math.round(totalDefects * 0.2), // 20% validation issues
    reopened: defectData.high.reopen + defectData.medium.reopen + defectData.low.reopen,
    fixed: defectData.high.fixed + defectData.medium.fixed + defectData.low.fixed,
  };
};
