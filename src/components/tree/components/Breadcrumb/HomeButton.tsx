import React from 'react';
import { Home } from 'lucide-react';

interface HomeButtonProps {
  onClick: () => void;
  className?: string;
}

/**
 * Home button component for breadcrumb navigation
 */
export const HomeButton: React.FC<HomeButtonProps> = ({ 
  onClick, 
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-1 hover:bg-white/[0.1] rounded transition-colors ${className}`}
      title="Go to root"
      aria-label="Go to root"
    >
      <Home className="w-4 h-4 text-gray-400" />
    </button>
  );
};