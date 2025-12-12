'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { VoiceInput } from './VoiceInput';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

interface ChatContainerProps {
  projectId: string;
}

export function ChatContainer({ projectId }: ChatContainerProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    isLoading,
    isStreaming,
    streamingContent,
    sendMessage,
  } = useChat(projectId);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Auto resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoiceResult = (text: string) => {
    setInput(text);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              sender={message.sender}
            />
          ))}

          {/* Streaming message */}
          {isStreaming && streamingContent && (
            <MessageBubble
              key="streaming"
              content={streamingContent}
              sender="ai"
              isStreaming
            />
          )}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && !streamingContent && (
          <motion.div
            className="flex items-center gap-2 text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
            <span className="text-sm">考え中...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <motion.div
        className="border-t border-slate-200 p-4 bg-white/80 backdrop-blur-xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          {/* Voice input */}
          <VoiceInput onResult={handleVoiceResult} />

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="メッセージを入力..."
              rows={1}
              className={cn(
                'w-full resize-none rounded-2xl px-4 py-3 pr-12',
                'bg-slate-100 border-0',
                'text-slate-700 placeholder:text-slate-400',
                'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
                'max-h-32 transition-all duration-200'
              )}
            />
          </div>

          {/* Send button */}
          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center',
              'bg-primary-500 text-white',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'hover:bg-primary-600 transition-colors'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
