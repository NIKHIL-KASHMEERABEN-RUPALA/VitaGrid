import React, { createContext, useContext, useState } from 'react';

export type NotificationType = 'critical' | 'approval' | 'stockout' | 'system' | 'agent';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionTargetModule?: string;
  actionData?: any;
}

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  toasts: ToastItem[];
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  dismissToast: (id: string) => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'critical',
    title: 'Severe Malaria Outbreak Vector Spike',
    message: 'Lake Victoria Basin detected +41.2% 7-day velocity with R₀ 1.48 across 18 PHC sentinel nodes.',
    timestamp: '2m ago',
    read: false,
    actionLabel: 'Open Outbreak Radar',
    actionTargetModule: 'outbreak-radar',
  },
  {
    id: 'notif-2',
    type: 'approval',
    title: 'Statutory ECDSA Sign-off Required (#842)',
    message: 'Likoni Subcounty emergency transfer of 3,200 Amoxicillin units requires Ministerial ECDSA authorization.',
    timestamp: '14m ago',
    read: false,
    actionLabel: 'Authorize Docket',
    actionTargetModule: 'human-approvals',
  },
  {
    id: 'notif-3',
    type: 'stockout',
    title: 'Critical Stockout Imminent: Likoni Subcounty',
    message: 'Amoxicillin 250mg dispersible inventory projected to run out in 1.8 days under current surge velocity.',
    timestamp: '28m ago',
    read: false,
    actionLabel: 'View Supply Chain',
    actionTargetModule: 'supply-chain',
  },
  {
    id: 'notif-4',
    type: 'agent',
    title: 'Multi-Agent Consensus Swarm Converged',
    message: 'Optimizer Agent solved Primal-Dual LP simplex: Fleet Convoy RL-09 staged for express corridor transit.',
    timestamp: '42m ago',
    read: true,
    actionLabel: 'Inspect Mesh',
    actionTargetModule: 'agent-mesh',
  },
  {
    id: 'notif-5',
    type: 'system',
    title: 'Sentinel Ingestion Complete',
    message: '100% of 2,840 primary healthcare centre telemetry packets synchronized. Zero PII egress confirmed.',
    timestamp: '1h ago',
    read: true,
    actionLabel: 'View Telemetry',
    actionTargetModule: 'command-center',
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'success'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastItem = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
        addNotification,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
