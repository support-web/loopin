'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  content: string;
  sender: 'user' | 'ai';
  isStreaming?: boolean;
}

export function MessageBubble({
  content,
  sender,
  isStreaming = false,
}: MessageBubbleProps) {
  const isUser = sender === 'user';

  return (
    <motion.div
      className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
    >
      {/* Avatar */}
      <motion.div
        className={cn(
          'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center',
          isUser
            ? 'bg-primary-500'
            : 'bg-gradient-to-br from-accent-500 to-primary-500'
        )}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </motion.div>

      {/* Message bubble */}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-primary-500 text-white rounded-tr-sm'
            : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>

        {/* Streaming indicator */}
        {isStreaming && (
          <motion.span
            className="inline-flex ml-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.span
              className="w-1.5 h-1.5 bg-current rounded-full mx-0.5"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
            />
            <motion.span
              className="w-1.5 h-1.5 bg-current rounded-full mx-0.5"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
            />
            <motion.span
              className="w-1.5 h-1.5 bg-current rounded-full mx-0.5"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
            />
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}
