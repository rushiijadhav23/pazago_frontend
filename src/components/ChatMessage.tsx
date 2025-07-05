import React from 'react';
import { Message } from '../types/chat';
import { Bot, User, AlertCircle } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  searchQuery?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isStreaming = false,
  searchQuery = '',
}) => {
  const isUser = message.role === 'user';
  const isError = message.error;

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className={`flex gap-3 max-w-4xl mx-auto px-4 py-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
        isUser 
          ? 'bg-blue-500 text-white' 
          : isError 
            ? 'bg-red-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
      }`}>
        {isUser ? (
          <User size={16} />
        ) : isError ? (
          <AlertCircle size={16} />
        ) : (
          <Bot size={16} />
        )}
      </div>

      {/* Message content */}
      <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl rounded-2xl px-4 py-3 transition-colors duration-200 ${
          isUser
            ? 'bg-blue-500 text-white'
            : isError
              ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm'
        }`}>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {highlightText(message.content, searchQuery)}
            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-current opacity-75 animate-pulse ml-1" />
            )}
          </div>
        </div>
        
        {/* Timestamp */}
        <div className={`text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(message.timestamp)}
          {isStreaming && (
            <span className="ml-2 text-blue-500 dark:text-blue-400">
              <span className="animate-pulse">●</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};