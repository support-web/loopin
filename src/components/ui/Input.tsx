'use client';

import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="w-full">
        {label && (
          <motion.label
            className="block text-sm font-medium text-slate-700 mb-2"
            animate={{
              color: isFocused ? '#0c85f1' : '#334155',
            }}
          >
            {label}
          </motion.label>
        )}
        <motion.div
          className="relative"
          animate={{
            scale: isFocused ? 1.01 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
        >
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'w-full px-4 py-3',
              'bg-white/60 backdrop-blur-sm',
              'border rounded-xl',
              'text-slate-700 placeholder:text-slate-400',
              'focus:outline-none focus:ring-2 focus:ring-primary-500/50',
              'transition-all duration-200',
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50'
                : 'border-slate-200 focus:border-primary-500',
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </motion.div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
