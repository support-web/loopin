'use client';

import { useCallback, useEffect } from 'react';
import { useChatStore } from '@/stores/chatStore';
import type { ChatMessage } from '@/types';
import { generateId } from '@/lib/utils';

export function useChat(projectId: string) {
  const {
    messages,
    isLoading,
    isStreaming,
    streamingContent,
    addMessage,
    setMessages,
    setLoading,
    setStreaming,
    appendStreamContent,
    resetStreamContent,
  } = useChatStore();

  // Fetch initial messages
  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await fetch(`/api/chat?projectId=${projectId}`);
        const data = await response.json();
        if (data.messages) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    }

    fetchMessages();
  }, [projectId, setMessages]);

  // Send message
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      setLoading(true);
      resetStreamContent();

      // Add user message immediately
      const userMessage: ChatMessage = {
        id: generateId(),
        project_id: projectId,
        sender: 'user',
        content: content.trim(),
        created_at: new Date().toISOString(),
      };
      addMessage(userMessage);

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            message: content.trim(),
          }),
        });

        if (!response.ok) throw new Error('Failed to send message');
        if (!response.body) throw new Error('No response body');

        setStreaming(true);
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                // Add the complete AI message
                const aiMessage: ChatMessage = {
                  id: generateId(),
                  project_id: projectId,
                  sender: 'ai',
                  content: useChatStore.getState().streamingContent,
                  created_at: new Date().toISOString(),
                };
                addMessage(aiMessage);
                resetStreamContent();
              } else {
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    appendStreamContent(parsed.content);
                  }
                } catch {
                  // Skip malformed JSON
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setLoading(false);
        setStreaming(false);
      }
    },
    [
      projectId,
      isLoading,
      addMessage,
      setLoading,
      setStreaming,
      appendStreamContent,
      resetStreamContent,
    ]
  );

  return {
    messages,
    isLoading,
    isStreaming,
    streamingContent,
    sendMessage,
  };
}
