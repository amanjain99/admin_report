import { useState, useEffect, useCallback } from 'react';
import type { DashboardItem, QueryResponse } from '../types';

const STORAGE_KEY = 'wayground-dashboard-items';

interface UseDashboardResult {
  dashboardItems: DashboardItem[];
  addToDashboard: (response: QueryResponse) => void;
  removeFromDashboard: (id: string) => void;
  isOnDashboard: (id: string) => boolean;
}

// Helper to load items from localStorage
function loadFromStorage(): DashboardItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((item: DashboardItem) => ({
        ...item,
        addedAt: new Date(item.addedAt),
        response: {
          ...item.response,
          timestamp: new Date(item.response.timestamp),
        },
      }));
    }
  } catch (error) {
    console.error('Failed to load dashboard items:', error);
  }
  return [];
}

// Helper to save items to localStorage
function saveToStorage(items: DashboardItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save dashboard items:', error);
  }
}

export function useDashboard(): UseDashboardResult {
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>(() => loadFromStorage());

  // Re-sync from localStorage when component mounts (handles cross-tab/page updates)
  useEffect(() => {
    setDashboardItems(loadFromStorage());
  }, []);

  const addToDashboard = useCallback((response: QueryResponse) => {
    const newItem: DashboardItem = {
      id: response.id,
      response,
      addedAt: new Date(),
    };

    setDashboardItems(prev => {
      // Don't add duplicates
      if (prev.some(item => item.id === response.id)) {
        return prev;
      }
      const updated = [newItem, ...prev];
      // Save synchronously to ensure persistence before navigation
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const removeFromDashboard = useCallback((id: string) => {
    setDashboardItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      // Save synchronously to ensure persistence before navigation
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const isOnDashboard = useCallback((id: string) => {
    return dashboardItems.some(item => item.id === id);
  }, [dashboardItems]);

  return {
    dashboardItems,
    addToDashboard,
    removeFromDashboard,
    isOnDashboard,
  };
}

