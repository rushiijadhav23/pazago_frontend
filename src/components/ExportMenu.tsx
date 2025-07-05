import React, { useState } from 'react';
import { Download, FileText, Code } from 'lucide-react';
import { Message } from '../types/chat';

interface ExportMenuProps {
  messages: Message[];
  onExportText: () => void;
  onExportJSON: () => void;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({
  messages,
  onExportText,
  onExportJSON,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (messages.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
        aria-label="Export chat"
        aria-expanded={isOpen}
      >
        <Download size={16} />
        <span className="hidden sm:inline">Export</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
            <div className="py-1">
              <button
                onClick={() => {
                  onExportText();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FileText size={16} />
                Export as Text
              </button>
              <button
                onClick={() => {
                  onExportJSON();
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Code size={16} />
                Export as JSON
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};