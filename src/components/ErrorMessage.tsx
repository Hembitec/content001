import React from 'react';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'info';
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  type = 'error',
  className 
}) => {
  const { darkMode } = useTheme();

  return (
    <div className={clsx(
      'rounded-lg p-4',
      type === 'error' && [
        'bg-red-500/5 border border-red-500/20',
        darkMode ? 'text-red-400' : 'text-red-600'
      ],
      type === 'info' && [
        'bg-purple-500/5 border border-purple-500/20',
        darkMode ? 'text-purple-300' : 'text-purple-600'
      ],
      className
    )}>
      <div className="flex items-center gap-2">
        {type === 'error' ? (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
        ) : (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 011 1v2a1 1 0 11-2 0V7a1 1 0 011-1zm0 6a1 1 0 100 2 1 1 0 000-2z" 
              clipRule="evenodd" 
            />
          </svg>
        )}
        <span className="italic">{message}</span>
      </div>
    </div>
  );
};
