import { useState, useEffect, useCallback } from 'react';
import type { PinnedQuery, QueryResponse } from '../types';

const STORAGE_KEY = 'wayground-pinned-queries';

interface UsePinnedQueriesResult {
  pinnedQueries: PinnedQuery[];
  pinQuery: (response: QueryResponse) => void;
  unpinQuery: (id: string) => void;
  isPinned: (query: string) => boolean;
}

export function usePinnedQueries(): UsePinnedQueriesResult {
  const [pinnedQueries, setPinnedQueries] = useState<PinnedQuery[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const queries = parsed.map((q: PinnedQuery) => ({
          ...q,
          pinnedAt: new Date(q.pinnedAt),
        }));
        setPinnedQueries(queries);
      }
    } catch (error) {
      console.error('Failed to load pinned queries:', error);
    }
  }, []);

  // Save to localStorage whenever pinned queries change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pinnedQueries));
    } catch (error) {
      console.error('Failed to save pinned queries:', error);
    }
  }, [pinnedQueries]);

  const pinQuery = useCallback((response: QueryResponse) => {
    const newPinned: PinnedQuery = {
      id: response.id,
      query: response.query,
      title: response.title,
      type: response.type,
      pinnedAt: new Date(),
    };

    setPinnedQueries(prev => {
      // Don't add duplicates
      if (prev.some(q => q.query.toLowerCase() === response.query.toLowerCase())) {
        return prev;
      }
      return [newPinned, ...prev];
    });
  }, []);

  const unpinQuery = useCallback((id: string) => {
    setPinnedQueries(prev => prev.filter(q => q.id !== id));
  }, []);

  const isPinned = useCallback((query: string) => {
    return pinnedQueries.some(q => q.query.toLowerCase() === query.toLowerCase());
  }, [pinnedQueries]);

  return {
    pinnedQueries,
    pinQuery,
    unpinQuery,
    isPinned,
  };
}

