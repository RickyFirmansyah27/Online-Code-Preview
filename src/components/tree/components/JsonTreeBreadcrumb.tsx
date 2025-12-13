"use client";

import React, { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { JsonTreeBreadcrumbProps, PathSegment } from '../types/json.types';
import { 
  useBreadcrumb,
  HomeButton,
  BreadcrumbSegment,
  BreadcrumbActions
} from './Breadcrumb';

export const JsonTreeBreadcrumb: React.FC<JsonTreeBreadcrumbProps> = ({
  path,
  onPathClick,
  onHomeClick,
  showHome = true,
  maxSegments = 5,
  truncateFrom = 'middle',
  showFullPath = false,
  enableCopy = true,
  className = '',
  testId = 'json-tree-breadcrumb',
}) => {
  // Use custom hook for breadcrumb logic
  const { displaySegments, handleSegmentClick } = useBreadcrumb({
    path,
    maxSegments,
    truncateFrom
  });

  // Handle segment click with error handling
  const handleSegmentClickWrapper = useCallback((segment: PathSegment, index: number) => {
    try {
      const segmentWithPath = handleSegmentClick(segment, index);
      onPathClick(segmentWithPath);
    } catch (error) {
      // Ignore errors from clicking truncated segments
      console.debug('Breadcrumb segment click ignored:', error);
    }
  }, [handleSegmentClick, onPathClick]);

  // Handle home click
  const handleHomeClick = useCallback(() => {
    onHomeClick?.();
  }, [onHomeClick]);

  return (
    <nav
      className={`flex items-center gap-2 text-sm ${className}`}
      data-testid={testId}
      aria-label="Breadcrumb navigation"
    >
      {/* Home button */}
      {showHome && (
        <HomeButton onClick={handleHomeClick} />
      )}

      {/* Breadcrumb segments */}
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <AnimatePresence mode="popLayout">
          {displaySegments.map((segment, index) => (
            <BreadcrumbSegment
              key={`${segment.key}-${index}`}
              segment={segment}
              index={index}
              isLast={index === displaySegments.length - 1}
              onClick={handleSegmentClickWrapper}
              animationDelay={index * 0.05}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <BreadcrumbActions
        path={path}
        enableCopy={enableCopy}
        showFullPath={showFullPath}
      />

      {/* Full path display (when expanded) */}
      {showFullPath && (
        <div
          className="absolute top-full left-0 right-0 mt-1 p-2 bg-[#1a1a22] border border-gray-700 rounded text-xs text-gray-300 font-mono z-10"
          role="tooltip"
        >
          {path || '(root)'}
        </div>
      )}
    </nav>
  );
};

export default JsonTreeBreadcrumb;