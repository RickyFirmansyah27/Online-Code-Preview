import { PathSegment } from '../../../types/json.types';

/**
 * Parse a path string into an array of path segments
 * Handles both object properties and array indices
 */
export const parsePath = (pathString: string): PathSegment[] => {
  if (!pathString) return [];
  
  const segments: PathSegment[] = [];
  const parts = pathString.split('.');
  
  parts.forEach((part) => {
    // Handle array indices (e.g., "users[0]" -> "users" and index 0)
    const arrayMatch = part.match(/^([^\[]+)\[(\d+)\]$/);
    if (arrayMatch) {
      segments.push({
        key: arrayMatch[1],
        type: 'property',
      });
      segments.push({
        key: arrayMatch[2],
        type: 'index',
        index: parseInt(arrayMatch[2], 10),
      });
    } else {
      segments.push({
        key: part,
        type: 'property',
      });
    }
  });
  
  return segments;
};

/**
 * Reconstruct a path string from an array of segments
 */
export const reconstructPath = (segments: PathSegment[]): string => {
  return segments
    .map(s => s.type === 'index' ? `[${s.key}]` : s.key)
    .join('.')
    .replace(/\.\[/g, '[');
};

/**
 * Truncate segments array based on configuration
 */
export const truncateSegments = (
  segments: PathSegment[], 
  maxSegments: number, 
  truncateFrom: 'start' | 'middle' | 'end'
): PathSegment[] => {
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
};