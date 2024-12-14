import React from 'react';
import clsx from 'clsx';

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className }) => {
  return (
    <div className={clsx('animate-spin rounded-full border-b-2 border-current', className)} />
  );
};
