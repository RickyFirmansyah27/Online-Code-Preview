import React from 'react';
import { CopyButton } from './CopyButton';

interface BreadcrumbActionsProps {
  path: string;
  enableCopy: boolean;
  showFullPath: boolean;
  onFullPathToggle?: () => void;
  className?: string;
}

/**
 * Actions component for breadcrumb (copy, full path toggle, etc.)
 */
export const BreadcrumbActions: React.FC<BreadcrumbActionsProps> = ({
  path,
  enableCopy,
  showFullPath,
  onFullPathToggle,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-1 flex-shrink-0 ${className}`}>
      {/* Copy button */}
      {enableCopy && path && (
        <CopyButton text={path} />
      )}
      
      {/* Full path toggle - TODO: Implement functionality */}
      {showFullPath && (
        <button
          onClick={onFullPathToggle}
          className="p-1 hover:bg-white/[0.1] rounded transition-colors"
          title="Toggle full path view"
          aria-label="Toggle full path view"
        >
          <span className="text-xs text-gray-400">...</span>
        </button>
      )}
    </div>
  );
};