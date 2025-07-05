import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatHeader } from './components/ChatHeader';
import { ChatContainer } from './components/ChatContainer';
import { ChatInput } from './components/ChatInput';
import { SearchBar } from './components/SearchBar';
import { useChat } from './hooks/useChat';
import { useSearch } from './hooks/useSearch';
import { useExport } from './hooks/useExport';

function App() {
  const { messages, isLoading, error, streamingMessageId, sendMessage, clearChat } = useChat();
  const { 
    searchQuery, 
    setSearchQuery, 
    isSearchOpen, 
    setIsSearchOpen, 
    filteredMessages, 
    searchResults, 
    clearSearch 
  } = useSearch(messages);
  const { exportAsText, exportAsJSON } = useExport();

  const handleToggleSearch = () => {
    if (isSearchOpen) {
      clearSearch();
    } else {
      setIsSearchOpen(true);
    }
  };

  const handleExportText = () => exportAsText(messages);
  const handleExportJSON = () => exportAsJSON(messages);

  const displayMessages = searchQuery ? filteredMessages : messages;

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <ChatHeader 
          onClearChat={clearChat} 
          messageCount={messages.length}
          hasError={!!error}
          messages={messages}
          onExportText={handleExportText}
          onExportJSON={handleExportJSON}
          onToggleSearch={handleToggleSearch}
        />
        
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          resultCount={searchResults.length}
        />
        
        <ChatContainer 
          messages={displayMessages}
          onSendMessage={sendMessage}
          isLoading={isLoading}
          streamingMessageId={streamingMessageId}
          searchQuery={searchQuery}
        />
        
        <ChatInput 
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;