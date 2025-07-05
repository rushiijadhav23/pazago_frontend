import React from 'react';
import { CloudSun, Thermometer, Cloud, Wind } from 'lucide-react';

interface EmptyStateProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSendMessage, isLoading }) => {
  const suggestions = [
    {
      icon: <CloudSun size={20} />,
      text: "What's the weather like today?",
      message: "What's the weather like today?"
    },
    {
      icon: <Thermometer size={20} />,
      text: "Current temperature in New York",
      message: "What's the current temperature in New York?"
    },
    {
      icon: <Cloud size={20} />,
      text: "Will it rain tomorrow?",
      message: "Will it rain tomorrow?"
    },
    {
      icon: <Wind size={20} />,
      text: "Wind conditions for sailing",
      message: "What are the wind conditions for sailing today?"
    }
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <CloudSun size={32} className="text-white" />
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-200">
          Welcome to Weather Agent
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed transition-colors duration-200">
          I'm here to help you get accurate weather information for any location. 
          Ask me about current conditions, forecasts, or specific weather details.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => !isLoading && onSendMessage(suggestion.message)}
              disabled={isLoading}
              className="flex items-center gap-3 p-4 text-left bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group transform hover:scale-105 active:scale-95"
              aria-label={`Ask: ${suggestion.text}`}
            >
              <div className="text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-200">
                {suggestion.icon}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-200 transition-colors duration-200">
                {suggestion.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};