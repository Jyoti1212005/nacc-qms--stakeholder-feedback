import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AcademicYear, Department, NotificationItem, NavigationPage } from '../types';
import { useAuth } from './AuthContext';

export type { NavigationPage };

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  activePage: NavigationPage;
  setActivePage: (page: NavigationPage) => void;
  selectedAcademicYear: string;
  setSelectedAcademicYear: (ayId: string) => void;
  academicYears: AcademicYear[];
  selectedDepartmentId: string;
  setSelectedDepartmentId: (deptId: string) => void;
  departments: Department[];
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshKey: number;
  triggerRefresh: () => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  simulateNotificationEvent: (eventType: 'ACTION_ASSIGNED' | 'SURVEY_PUBLISHED') => Promise<void>;
  latestRealtimeAlert: NotificationItem | null;
  clearLatestRealtimeAlert: () => void;
  isPolling: boolean;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (open: boolean) => void;
  toggleMobileNav: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Web Audio API chime for immediate auditory alert (100% in-browser, no asset dependencies)
const playNotificationChime = (isUrgent = false) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = isUrgent ? 'triangle' : 'sine';
    const now = ctx.currentTime;
    
    if (isUrgent) {
      // Urgent chime (higher pitch double ping for Action Plans)
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
    } else {
      // Pleasant melodic chime for surveys
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5
    }

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.38);
  } catch {
    // Audio autoplay restrictions are gracefully ignored
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, canAccessPage, defaultLandingPage, currentUser } = useAuth();
  const [activePage, setActivePage] = useState<NavigationPage>('dashboard');

  // Ensure activePage is permitted when user role changes
  useEffect(() => {
    if (currentUser) {
      if (!canAccessPage(activePage)) {
        setActivePage(defaultLandingPage);
      }
    }
  }, [currentUser, defaultLandingPage]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('ay-5');
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([
    { id: 'ay-1', name: '2022-23', startDate: '2022-07-01', endDate: '2023-06-30', isCurrent: false },
    { id: 'ay-2', name: '2023-24', startDate: '2023-07-01', endDate: '2024-06-30', isCurrent: false },
    { id: 'ay-3', name: '2024-25', startDate: '2024-07-01', endDate: '2025-06-30', isCurrent: false },
    { id: 'ay-4', name: '2025-26', startDate: '2025-07-01', endDate: '2026-06-30', isCurrent: false },
    { id: 'ay-5', name: '2026-27', startDate: '2026-07-01', endDate: '2027-06-30', isCurrent: true },
  ]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('all');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [latestRealtimeAlert, setLatestRealtimeAlert] = useState<NotificationItem | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const toggleMobileNav = () => setIsMobileNavOpen((prev) => !prev);

  // Set of known notification IDs to detect newly arrived alerts during polling
  const knownNotificationIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef<boolean>(true);

  // Load departments
  useEffect(() => {
    fetch('/api/departments')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDepartments(data);
      })
      .catch((err) => console.warn('Could not load departments:', err));
  }, []);

  // Real-time Notification Polling Service
  // Polls server every 4 seconds to detect newly assigned action plans or published surveys
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data: NotificationItem[] = await res.json();
      if (!Array.isArray(data)) return;

      if (isInitialLoadRef.current) {
        // Initial load: populate known IDs without alert spam
        knownNotificationIdsRef.current = new Set(data.map((n) => n.id));
        setNotifications(data);
        isInitialLoadRef.current = false;
        return;
      }

      // Check for incoming notifications that weren't present before
      const newItems: NotificationItem[] = [];
      for (const item of data) {
        if (!knownNotificationIdsRef.current.has(item.id)) {
          knownNotificationIdsRef.current.add(item.id);
          newItems.push(item);
        }
      }

      if (newItems.length > 0) {
        // Find newest unread notification
        const newestUnread = newItems.find((n) => !n.isRead);
        if (newestUnread) {
          const isActionPlan =
            newestUnread.type === 'ACTION_ASSIGNED' ||
            newestUnread.title.toLowerCase().includes('action') ||
            newestUnread.title.toLowerCase().includes('capa');

          const isSurvey =
            newestUnread.type === 'SURVEY_PUBLISHED' ||
            newestUnread.title.toLowerCase().includes('survey');

          if (isActionPlan) {
            playNotificationChime(true);
            setLatestRealtimeAlert(newestUnread);
            showToast(`📋 Action Plan Assigned: ${newestUnread.title} — ${newestUnread.message}`, 'info');
          } else if (isSurvey) {
            playNotificationChime(false);
            setLatestRealtimeAlert(newestUnread);
            showToast(`📝 New Survey Published: ${newestUnread.title} — ${newestUnread.message}`, 'info');
          } else {
            playNotificationChime(false);
            showToast(`🔔 ${newestUnread.title}: ${newestUnread.message}`, 'info');
          }
        }
        setNotifications(data);
      } else {
        // Update read/unread flags if state changed
        setNotifications(data);
      }
    } catch (err) {
      console.warn('Notification poll error:', err);
    }
  };

  // Run on mount, token change, or refreshKey
  useEffect(() => {
    isInitialLoadRef.current = true;
    fetchNotifications();
  }, [token, refreshKey]);

  // Polling interval: every 4 seconds
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      fetchNotifications();
    }, 4000);
    return () => clearInterval(interval);
  }, [token]);

  // Method to simulate real-time notification event directly from UI
  const simulateNotificationEvent = async (eventType: 'ACTION_ASSIGNED' | 'SURVEY_PUBLISHED') => {
    try {
      const res = await fetch('/api/notifications/simulate-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventType }),
      });
      const data = await res.json();
      if (data.notification) {
        // Poll immediately to trigger state change and pulsing peach dot
        await fetchNotifications();
      }
    } catch (err) {
      console.error('Failed to simulate notification event:', err);
    }
  };

  const clearLatestRealtimeAlert = () => setLatestRealtimeAlert(null);

  // Keyboard shortcut Ctrl+K / Cmd+K for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  const markAsRead = (id: string) => {
    fetch(`/api/notifications/${id}/read`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      if (latestRealtimeAlert?.id === id) {
        setLatestRealtimeAlert(null);
      }
    });
  };

  const markAllAsRead = () => {
    fetch('/api/notifications/read-all', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setLatestRealtimeAlert(null);
    });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedAcademicYear,
        setSelectedAcademicYear,
        academicYears,
        selectedDepartmentId,
        setSelectedDepartmentId,
        departments,
        isSearchOpen,
        setIsSearchOpen,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        refreshKey,
        triggerRefresh,
        toasts,
        showToast,
        removeToast,
        simulateNotificationEvent,
        latestRealtimeAlert,
        clearLatestRealtimeAlert,
        isPolling,
        isMobileNavOpen,
        setIsMobileNavOpen,
        toggleMobileNav,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
