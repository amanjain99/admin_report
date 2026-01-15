import { useState, useCallback } from 'react';
import type { QueryResponse, ConversationMessage } from '../types';
import { processQuery } from '../services/queryParser';
import { refineQueryWithAI, isAIServiceAvailable } from '../services/aiQueryRefiner';
import { mockWaygroundData } from '../data/mockData';

interface UseQueryResult {
  isLoading: boolean;
  conversation: ConversationMessage[];
  submitQuery: (query: string) => Promise<void>;
  clearConversation: () => void;
  aiEnabled: boolean;
}

export function useQuery(): UseQueryResult {
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const aiEnabled = isAIServiceAvailable();

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

    let queryToProcess = query;
    let refinedInfo: { originalQuery: string; refinedQuery: string; confidence: number } | null = null;

    // Use AI to refine the query if available
    if (aiEnabled) {
      try {
        const refined = await refineQueryWithAI(query);
        queryToProcess = refined.refinedQuery;
        refinedInfo = {
          originalQuery: refined.originalQuery,
          refinedQuery: refined.refinedQuery,
          confidence: refined.confidence,
        };
        console.log('AI refined query:', refined);
      } catch (error) {
        console.error('AI refinement failed, using original query:', error);
      }
    } else {
      // Simulate processing delay when AI is not available
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    }

    // Process the query (refined or original)
    const response = processQuery(queryToProcess, mockWaygroundData);

    // Add assistant response
    const assistantMessage: ConversationMessage = {
      id: `assistant-${Date.now()}`,
      type: 'assistant',
      content: response?.title || 'Unable to process query',
      response: response || undefined,
      timestamp: new Date(),
      refinedQuery: refinedInfo?.refinedQuery !== refinedInfo?.originalQuery ? refinedInfo : undefined,
    };

    setConversation(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  }, [aiEnabled]);

  const clearConversation = useCallback(() => {
    setConversation([]);
  }, []);

  return {
    isLoading,
    conversation,
    submitQuery,
    clearConversation,
    aiEnabled,
  };
}

