import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, ChatState } from '../types/chat';

const API_ENDPOINT = 'https://brief-thousands-sunset-9fcb1c78-485f-4967-ac04-2759a8fa1462.mastra.cloud/api/agents/weatherAgent/stream';

// Replace with your actual college roll number
const THREAD_ID = 'TU3F2122167';

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    streamingMessageId: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const clearChat = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
      streamingMessageId: null,
    });
  }, []);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    return newMessage.id;
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.map(msg =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    }));
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || state.isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    // Create assistant message placeholder
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, assistantMessage],
      streamingMessageId: assistantMessageId,
    }));

    try {
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const requestBody = {
        messages: [
          ...state.messages.map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content,
          })),
          {
            role: 'user',
            content: content.trim(),
          },
        ],
        runId: 'weatherAgent',
        maxRetries: 2,
        maxSteps: 5,
        temperature: 0.5,
        topP: 1,
        runtimeContext: {},
        threadId: THREAD_ID,
        resourceId: 'weatherAgent',
      };

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7',
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
          'x-mastra-dev-playground': 'true',
        },
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response stream available');
      }

      const decoder = new TextDecoder();
      let accumulatedContent = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.trim() === '') continue;

            try {
              // Handle different streaming formats
              if (line.startsWith('f:')) {
                // Initial message metadata - skip for now
                continue;
              } else if (line.startsWith('0:')) {
                // Content chunk
                const contentPart = line.slice(2);
                if (contentPart) {
                  try {
                    const parsed = JSON.parse(contentPart);
                    if (typeof parsed === 'string') {
                      accumulatedContent += parsed;
                      updateMessage(assistantMessageId, {
                        content: accumulatedContent,
                        isStreaming: true,
                      });
                    }
                  } catch (e) {
                    // If it's not JSON, treat as plain text
                    accumulatedContent += contentPart;
                    updateMessage(assistantMessageId, {
                      content: accumulatedContent,
                      isStreaming: true,
                    });
                  }
                }
              } else if (line.startsWith('e:') || line.startsWith('d:')) {
                // End markers - we can use these to detect completion
                continue;
              } else if (line.startsWith('data: ')) {
                // Standard SSE format fallback
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    accumulatedContent += parsed.content;
                    updateMessage(assistantMessageId, {
                      content: accumulatedContent,
                      isStreaming: true,
                    });
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            } catch (e) {
              console.warn('Error parsing streaming line:', line, e);
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      // Mark streaming as complete
      updateMessage(assistantMessageId, {
        content: accumulatedContent || 'No response received',
        isStreaming: false,
      });

    } catch (error) {
      console.error('Chat error:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was cancelled
        setState(prev => ({
          ...prev,
          messages: prev.messages.filter(msg => msg.id !== assistantMessageId),
          isLoading: false,
          streamingMessageId: null,
        }));
        return;
      }

      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      updateMessage(assistantMessageId, {
        content: `Error: ${errorMessage}`,
        isStreaming: false,
        error: true,
      });

      setState(prev => ({
        ...prev,
        error: errorMessage,
      }));
    } finally {
      setState(prev => ({
        ...prev,
        isLoading: false,
        streamingMessageId: null,
      }));
    }
  }, [state.messages, state.isLoading, updateMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    streamingMessageId: state.streamingMessageId,
    sendMessage,
    clearChat,
  };
};