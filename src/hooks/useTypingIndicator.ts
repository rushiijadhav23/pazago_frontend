import { useState, useEffect } from 'react';

export const useTypingIndicator = (isLoading: boolean, streamingMessageId: string | null) => {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isLoading && !streamingMessageId) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [isLoading, streamingMessageId]);

  return isTyping;
};