import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { EmptyState } from './EmptyState';
import { TypingIndicator } from './TypingIndicator';
import { Message } from '../types/chat';
import { useTypingIndicator } from '../hooks/useTypingIndicator';

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  streamingMessageId: string | null;
  searchQuery?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ 
  messages, 
  onSendMessage, 
  isLoading, 
  streamingMessageId,
  searchQuery = '',
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isTyping = useTypingIndicator(isLoading, streamingMessageId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingMessageId, isTyping]);

  if (messages.length === 0) {
    return <EmptyState onSendMessage={onSendMessage} isLoading={isLoading} />;
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="min-h-full py-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isStreaming={message.id === streamingMessageId}
            searchQuery={searchQuery}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};