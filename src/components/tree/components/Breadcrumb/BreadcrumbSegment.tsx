import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { PathSegment } from '../../types/json.types';

interface BreadcrumbSegmentProps {
  segment: PathSegment;
  index: number;
  isLast: boolean;
  onClick: (segment: PathSegment, index: number) => void;
  animationDelay?: number;
}

/**
 * Individual breadcrumb segment component
 */
export const BreadcrumbSegment: React.FC<BreadcrumbSegmentProps> = ({
  segment,
  index,
  onClick,
  animationDelay = 0
}) => {
  const isTruncated = segment.key === '...';
  
  const handleClick = () => {
    if (!isTruncated) {
      onClick(segment, index);
    }
  };

  return (
    <React.Fragment>
      {/* Separator */}
      {index > 0 && (
        <ChevronRight className="w-3 h-3 text-gray-500 flex-shrink-0" />
      )}
      
      {/* Segment */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ delay: animationDelay }}
        onClick={handleClick}
        className={`
          px-2 py-1 rounded transition-colors truncate max-w-32
          ${isTruncated
            ? 'text-gray-500 cursor-default'
            : 'text-gray-300 hover:bg-white/[0.1] hover:text-white'
          }
        `}
        disabled={isTruncated}
        title={isTruncated ? 'Path truncated' : segment.key}
        aria-label={isTruncated ? 'Path truncated' : `Navigate to ${segment.key}`}
        aria-disabled={isTruncated}
      >
        <span className="font-mono text-xs">
          {segment.type === 'index' ? `[${segment.key}]` : segment.key}
        </span>
      </motion.button>
    </React.Fragment>
  );
};