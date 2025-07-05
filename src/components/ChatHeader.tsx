import React from 'react';
import { Cloud, Trash2, AlertCircle, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { ExportMenu } from './ExportMenu';
import { Message } from '../types/chat';

interface ChatHeaderProps {
  onClearChat: () => void;
  messageCount: number;
  hasError?: boolean;
  messages: Message[];
  onExportText: () => void;
  onExportJSON: () => void;
  onToggleSearch: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onClearChat, 
  messageCount, 
  hasError = false,
  messages,
  onExportText,
  onExportJSON,
  onToggleSearch,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 shadow-sm transition-colors duration-200">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <Cloud size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Weather Agent</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {messageCount === 0 ? 'Ready to help with weather information' : `${messageCount} messages`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {hasError && (
            <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle size={16} />
              <span>Connection issue</span>
            </div>
          )}
          
          {messageCount > 0 && (
            <button
              onClick={onToggleSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
              aria-label="Search messages"
            >
              <Search size={16} />
              <span className="hidden sm:inline">Search</span>
            </button>
          )}

          <ExportMenu
            messages={messages}
            onExportText={onExportText}
            onExportJSON={onExportJSON}
          />

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors duration-200"
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
          </button>
          
          {messageCount > 0 && (
            <button
              onClick={onClearChat}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
              aria-label="Clear chat"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};