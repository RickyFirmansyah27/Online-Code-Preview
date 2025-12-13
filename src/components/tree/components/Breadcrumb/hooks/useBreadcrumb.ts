import { useCallback, useMemo } from 'react';
import { PathSegment } from '../../../types/json.types';
import { parsePath, reconstructPath, truncateSegments } from '../utils/pathUtils';

interface UseBreadcrumbProps {
  path: string;
  maxSegments: number;
  truncateFrom: 'start' | 'middle' | 'end';
}

interface UseBreadcrumbReturn {
  segments: PathSegment[];
  displaySegments: PathSegment[];
  handleSegmentClick: (segment: PathSegment, index: number) => PathSegment & { fullPath: string };
}

/**
 * Custom hook for breadcrumb logic and state management
 */
export const useBreadcrumb = ({
  path,
  maxSegments,
  truncateFrom
}: UseBreadcrumbProps): UseBreadcrumbReturn => {
  // Parse path into segments
  const segments = useMemo(() => parsePath(path), [path]);
  
  // Get display segments (with truncation if needed)
  const displaySegments = useMemo(() => 
    truncateSegments(segments, maxSegments, truncateFrom),
    [segments, maxSegments, truncateFrom]
  );

  // Handle segment click - returns the segment with reconstructed path
  const handleSegmentClick = useCallback((
    segment: PathSegment, 
    index: number
  ): PathSegment & { fullPath: string } => {
    if (segment.key === '...') {
      throw new Error('Cannot click on truncated segment');
    }
    
    // Reconstruct path up to this segment
    const pathSegments = displaySegments.slice(0, index + 1);
    const fullPath = reconstructPath(pathSegments);
    
    // Create proper PathSegment with fullPath
    return {
      ...segment,
      fullPath,
    };
  }, [displaySegments]);

  return {
    segments,
    displaySegments,
    handleSegmentClick,
  };
};