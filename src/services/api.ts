import {
  mockNotifications,
  mockProjects,
  mockDefects,
  Notification,
  ProjectData,
  DefectRecord,
} from '../data/mockData';

// Switch this config when ready to integrate with Java Backend using Axios
// const USE_MOCK = false;
// import axios from 'axios';
// const API_BASE_URL = 'http://localhost:8080/api';

// Simple delay helper to simulate backend response latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dynamic local database state to persist mutations in memory during testing
let dbNotifications = [...mockNotifications];
let dbProjects = [...mockProjects];
let dbDefects = [...mockDefects];

export interface DefectFilters {
  project?: string;
  search?: string;
  severity?: string;
  priority?: string;
  status?: string;
  module?: string;
  submodule?: string;
  type?: string;
  release?: string;
  assignedTo?: string;
  enteredBy?: string;
}

export interface FilterOptions {
  modules: string[];
  submodules: string[];
  types: string[];
  releases: string[];
  developers: string[];
  enteredBy: string[];
}

export interface DashboardMetrics {
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
}

// ---------------- PROJECTS API ----------------

export const getProjects = async (): Promise<string[]> => {
  await delay(200);
  return dbProjects.map(p => p.name);
};

export const getProjectDetails = async (projectName: string): Promise<ProjectData | undefined> => {
  await delay(200);
  const project = dbProjects.find(p => p.name === projectName);
  if (!project) return undefined;

  // Let's dynamically calculate defectData counts from dbDefects to stay in-sync with mutations
  const projectDefects = dbDefects.filter(d => d.project === projectName);
  
  const initialDefectData = () => ({
    total: 0, reopen: 0, closed: 0, new: 0, reject: 0, open: 0, duplicate: 0, fixed: 0
  });

  const defectData = {
    high: initialDefectData(),
    medium: initialDefectData(),
    low: initialDefectData(),
  };

  projectDefects.forEach(defect => {
    const sev = defect.severity.toLowerCase() as 'high' | 'medium' | 'low';
    const status = defect.status.toLowerCase();
    
    if (defectData[sev]) {
      defectData[sev].total += 1;
      if (status === 'new') defectData[sev].new += 1;
      else if (status === 'open') defectData[sev].open += 1;
      else if (status === 'in progress') defectData[sev].open += 1; // Map as active open defect count
      else if (status === 'fixed') defectData[sev].fixed += 1;
      else if (status === 'closed') defectData[sev].closed += 1;
      else if (status === 'duplicate') defectData[sev].duplicate += 1;
      else if (status === 'rejected') defectData[sev].reject += 1;
    }
  });

  // Keep reopens from initial mock metadata or recalculate
  const originalProject = mockProjects.find(p => p.name === projectName);
  if (originalProject) {
    defectData.high.reopen = originalProject.defectData.high.reopen;
    defectData.medium.reopen = originalProject.defectData.medium.reopen;
    defectData.low.reopen = originalProject.defectData.low.reopen;
  }

  return {
    name: project.name,
    risk: project.risk,
    defectData,
  };
};

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  await delay(200);
  return {
    highRiskCount: dbProjects.filter(p => p.risk === 'high').length,
    mediumRiskCount: dbProjects.filter(p => p.risk === 'medium').length,
    lowRiskCount: dbProjects.filter(p => p.risk === 'low').length,
  };
};

// ---------------- DEFECTS API ----------------

export const getDefects = async (filters: DefectFilters): Promise<DefectRecord[]> => {
  await delay(250);
  
  return dbDefects.filter(defect => {
    if (filters.project && defect.project !== filters.project) {
      return false;
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matchesSearch =
        defect.id.toLowerCase().includes(search) ||
        defect.briefDescription.toLowerCase().includes(search) ||
        defect.module.toLowerCase().includes(search) ||
        defect.submodule.toLowerCase().includes(search);
      if (!matchesSearch) return false;
    }
    
    if (filters.severity && filters.severity !== 'All' && defect.severity !== filters.severity) {
      return false;
    }
    if (filters.priority && filters.priority !== 'All' && defect.priority !== filters.priority) {
      return false;
    }
    if (filters.status && filters.status !== 'All' && defect.status !== filters.status) {
      return false;
    }
    if (filters.module && filters.module !== 'All' && defect.module !== filters.module) {
      return false;
    }
    if (filters.submodule && filters.submodule !== 'All' && defect.submodule !== filters.submodule) {
      return false;
    }
    if (filters.type && filters.type !== 'All' && defect.type !== filters.type) {
      return false;
    }
    if (filters.release && filters.release !== 'All' && defect.release !== filters.release) {
      return false;
    }
    if (filters.assignedTo && filters.assignedTo !== 'All' && defect.assignedTo !== filters.assignedTo) {
      return false;
    }
    if (filters.enteredBy && filters.enteredBy !== 'All' && defect.enteredBy !== filters.enteredBy) {
      return false;
    }
    
    return true;
  });
};

export const getFilterOptions = async (projectName: string): Promise<FilterOptions> => {
  await delay(150);
  const projectDefects = dbDefects.filter(d => d.project === projectName);
  
  const modules = Array.from(new Set(projectDefects.map(d => d.module).filter(Boolean))).sort();
  
  // Extract all submodules belonging to any module inside this project
  const submodules = Array.from(new Set(projectDefects.map(d => d.submodule).filter(Boolean))).sort();
  const types = Array.from(new Set(projectDefects.map(d => d.type).filter(Boolean))).sort();
  const releases = Array.from(new Set(projectDefects.map(d => d.release).filter(Boolean))).sort();
  const developers = Array.from(new Set(projectDefects.map(d => d.assignedTo).filter(Boolean))).sort();
  const enteredBy = Array.from(new Set(projectDefects.map(d => d.enteredBy).filter(Boolean))).sort();
  
  return {
    modules,
    submodules,
    types,
    releases,
    developers,
    enteredBy,
  };
};

export const updateDefectStatus = async (
  defectId: string,
  newStatus: DefectRecord['status']
): Promise<DefectRecord | undefined> => {
  await delay(200);
  const defect = dbDefects.find(d => d.id === defectId);
  if (defect) {
    defect.status = newStatus;
  }
  return defect;
};

export const reassignDefect = async (
  defectId: string,
  assignedTo: string
): Promise<DefectRecord | undefined> => {
  await delay(200);
  const defect = dbDefects.find(d => d.id === defectId);
  if (defect) {
    defect.assignedTo = assignedTo;
  }
  return defect;
};

// ---------------- NOTIFICATIONS API ----------------

export const getNotifications = async (): Promise<Notification[]> => {
  await delay(150);
  return dbNotifications;
};

export const getUnreadNotificationCount = async (): Promise<number> => {
  await delay(100);
  return dbNotifications.filter(n => !n.read).length;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await delay(100);
  const notification = dbNotifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
  }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await delay(150);
  dbNotifications.forEach(n => {
    n.read = true;
  });
};
