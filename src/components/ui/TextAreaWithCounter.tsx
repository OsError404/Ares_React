import React from 'react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

interface TextAreaWithCounterProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  maxLength: number;
  value: string;
}

export const TextAreaWithCounter = React.forwardRef<HTMLTextAreaElement, TextAreaWithCounterProps>(
  ({ label, error, maxLength, value, className, onChange, ...props }, ref) => {
    const remainingChars = maxLength - value.length;
    const isNearLimit = remainingChars <= 50;

    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="relative">
          <textarea
            ref={ref}
            className={cn(
              "block w-full rounded-lg border-gray-300 shadow-sm transition-colors",
              "focus:border-primary-500 focus:ring-primary-500",
              "placeholder:text-gray-400",
              error && "border-error focus:border-error focus:ring-error",
              className
            )}
            maxLength={maxLength}
            onChange={onChange}
            value={value}
            {...props}
          />
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "absolute bottom-2 right-2 text-xs",
              isNearLimit ? "text-warning" : "text-gray-500",
              remainingChars === 0 && "text-error"
            )}
          >
            {remainingChars} caracteres restantes
          </motion.div>
        </div>
        {error && (
          <p className="text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

TextAreaWithCounter.displayName = 'TextAreaWithCounter';