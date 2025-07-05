import { useState, useMemo } from 'react';
import { Message } from '../types/chat';

export const useSearch = (messages: Message[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    
    return messages.filter(message =>
      message.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [messages, searchQuery]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    return messages
      .map((message, index) => ({ message, index }))
      .filter(({ message }) =>
        message.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [messages, searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    isSearchOpen,
    setIsSearchOpen,
    filteredMessages,
    searchResults,
    clearSearch,
    hasResults: searchResults.length > 0,
  };
};