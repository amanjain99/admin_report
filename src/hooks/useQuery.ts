import { useState, useCallback } from 'react';
import type { QueryResponse, ConversationMessage } from '../types';
import { processQuery } from '../services/queryParser';
import { mockWaygroundData } from '../data/mockData';

interface UseQueryResult {
  isLoading: boolean;
  conversation: ConversationMessage[];
  submitQuery: (query: string) => Promise<void>;
  clearConversation: () => void;
}

export function useQuery(): UseQueryResult {
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);

  const submitQuery = useCallback(async (query: string) => {
    if (!query.trim()) return;

    // Add user message
    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: query,
      timestamp: new Date(),
    };

    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate processing delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    // Process the query
    const response = processQuery(query, mockWaygroundData);

    // Add assistant response
    const assistantMessage: ConversationMessage = {
      id: `assistant-${Date.now()}`,
      type: 'assistant',
      content: response?.title || 'Unable to process query',
      response: response || undefined,
      timestamp: new Date(),
    };

    setConversation(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  }, []);

  const clearConversation = useCallback(() => {
    setConversation([]);
  }, []);

  return {
    isLoading,
    conversation,
    submitQuery,
    clearConversation,
  };
}

