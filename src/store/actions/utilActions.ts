import { JsonNode, JsonValue, PathSegment, ValidationResult, ExportOptions, ImportOptions } from '../../components/tree/types/json.types';
import { JsonTreeState } from '../types';
import { exportJson, importData } from '../../components/tree/utils/exportUtils';
import { initialJsonTreeState } from '../constants';

/**
 * Utility operations actions
 */
export const createUtilActions = (set: (state: Partial<JsonTreeState>) => void, get: () => JsonTreeState) => ({
  /**
   * Get node by path
   */
  getNodeByPath: (path: string): JsonNode | null => {
    const { rootNode } = get();
    if (!rootNode) return null;
    
    const findNode = (node: JsonNode, targetPath: string): JsonNode | null => {
      if (node.path === targetPath) return node;
      
      if (node.children) {
        for (const child of node.children) {
          const found = findNode(child, targetPath);
          if (found) return found;
        }
      }
      
      return null;
    };
    
    return findNode(rootNode, path);
  },

  /**
   * Get path segments from path string
   */
  getPathSegments: (path: string): PathSegment[] => {
    if (!path) return [];
    const segments: PathSegment[] = [];
    const parts = path.split('.');
    
    parts.forEach((part) => {
      const arrayMatch = part.match(/^([^\[]+)\[(\d+)\]$/);
      if (arrayMatch) {
        segments.push({ key: arrayMatch[1], type: 'property' });
        segments.push({ key: arrayMatch[2], type: 'index', index: parseInt(arrayMatch[2]) });
      } else {
        segments.push({ key: part, type: 'property' });
      }
    });
    
    return segments;
  },

  /**
   * Validate JSON data
   */
  validateJson: (): ValidationResult => {
    const { rootNode } = get();
    
    if (!rootNode) {
      return {
        isValid: false,
        errors: [{ path: '', message: 'No JSON data to validate', code: 'NO_DATA', severity: 'error' as const }],
        warnings: [],
      };
    }
    
    // Implement validation logic
    return {
      isValid: true,
      errors: [],
      warnings: [],
    };
  },

  /**
   * Export JSON data with options
   */
  exportJson: (options: ExportOptions): string => {
    const { rootNode } = get();
    if (!rootNode) return '';
    
    return exportJson(rootNode.value, options);
  },

  /**
   * Import JSON data with options
   */
  importJson: (data: string, options: ImportOptions) => {
    const _parsedData = importData(data, options);
    // Implement logic to update the store's state with the imported data
    console.warn('importJson not fully implemented yet');
  },

  /**
   * Reset store to initial state
   */
  reset: () => {
    set(initialJsonTreeState as JsonTreeState);
  },
});