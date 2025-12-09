"use client";

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ChevronRight, Copy } from 'lucide-react';
import { JsonTreeBreadcrumbProps, PathSegment } from '../types/json.types';

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
  // Parse path into segments
  const parsePath = useCallback((pathString: string): PathSegment[] => {
    if (!pathString) return [];
    
    const segments: PathSegment[] = [];
    const parts = pathString.split('.');
    
    parts.forEach((part) => {
      // Handle array indices
      const arrayMatch = part.match(/^([^\[]+)\[(\d+)\]$/);
      if (arrayMatch) {
        segments.push({
          key: arrayMatch[1],
          type: 'property',
        });
        segments.push({
          key: arrayMatch[2],
          type: 'index',
          index: parseInt(arrayMatch[2]),
        });
      } else {
        segments.push({
          key: part,
          type: 'property',
        });
      }
    });
    
    return segments;
  }, []);

  const segments = parsePath(path);
  
  // Truncate segments if needed
  const getDisplaySegments = useCallback(() => {
    if (segments.length <= maxSegments) {
      return segments;
    }
    
    switch (truncateFrom) {
      case 'start':
        return [
          { key: '...', type: 'property' as const },
          ...segments.slice(-(maxSegments - 1))
        ];
      case 'middle':
        const startCount = Math.floor((maxSegments - 1) / 2);
        const endCount = maxSegments - 1 - startCount;
        return [
          ...segments.slice(0, startCount),
          { key: '...', type: 'property' as const },
          ...segments.slice(-endCount)
        ];
      case 'end':
        return [
          ...segments.slice(0, maxSegments - 1),
          { key: '...', type: 'property' as const }
        ];
      default:
        return segments;
    }
  }, [segments, maxSegments, truncateFrom]);

  const displaySegments = getDisplaySegments();

  // Handle segment click
  const handleSegmentClick = useCallback((segment: PathSegment, index: number) => {
    if (segment.key === '...') return;
    
    // Reconstruct path up to this segment
    const pathSegments = displaySegments.slice(0, index + 1);
    const fullPath = pathSegments
      .map(s => s.type === 'index' ? `[${s.key}]` : s.key)
      .join('.')
      .replace(/\.\[/g, '[');
    
    onPathClick({ ...segment, fullPath: fullPath } as PathSegment & { fullPath: string });
  }, [displaySegments, onPathClick]);

  // Handle copy path
  const handleCopyPath = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(path);
      // Show toast notification
    } catch (error) {
      console.error('Failed to copy path:', error);
    }
  }, [path]);

  // Handle home click
  const handleHomeClick = useCallback(() => {
    onHomeClick?.();
  }, [onHomeClick]);

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`} data-testid={testId}>
      {/* Home button */}
      {showHome && (
        <button
          onClick={handleHomeClick}
          className="p-1 hover:bg-white/[0.1] rounded transition-colors"
          title="Go to root"
        >
          <Home className="w-4 h-4 text-gray-400" />
        </button>
      )}

      {/* Breadcrumb segments */}
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <AnimatePresence mode="popLayout">
          {displaySegments.map((segment, index) => (
            <React.Fragment key={`${segment.key}-${index}`}>
              {/* Separator */}
              {index > 0 && (
                <ChevronRight className="w-3 h-3 text-gray-500 flex-shrink-0" />
              )}
              
              {/* Segment */}
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSegmentClick(segment, index)}
                className={`
                  px-2 py-1 rounded transition-colors truncate max-w-32
                  ${segment.key === '...' 
                    ? 'text-gray-500 cursor-default' 
                    : 'text-gray-300 hover:bg-white/[0.1] hover:text-white'
                  }
                `}
                disabled={segment.key === '...'}
                title={segment.key === '...' ? 'Path truncated' : segment.key}
              >
                <span className="font-mono text-xs">
                  {segment.type === 'index' ? `[${segment.key}]` : segment.key}
                </span>
              </motion.button>
            </React.Fragment>
          ))}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Copy button */}
        {enableCopy && path && (
          <button
            onClick={handleCopyPath}
            className="p-1 hover:bg-white/[0.1] rounded transition-colors"
            title="Copy full path"
          >
            <Copy className="w-3 h-3 text-gray-400" />
          </button>
        )}
        
        {/* Full path toggle */}
        {showFullPath && (
          <button
            className="p-1 hover:bg-white/[0.1] rounded transition-colors"
            title="Toggle full path view"
          >
            <span className="text-xs text-gray-400">...</span>
          </button>
        )}
      </div>

      {/* Full path display (when expanded) */}
      {showFullPath && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-[#1a1a22] border border-gray-700 rounded text-xs text-gray-300 font-mono">
          {path || '(root)'}
        </div>
      )}
    </div>
  );
};

export default JsonTreeBreadcrumb;