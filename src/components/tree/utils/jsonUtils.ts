/**
 * JSON manipulation utilities for the tree menu
 */

import { JsonValue, JsonObject, JsonArray, JsonNode, JsonNodeType, JsonPath, PathSegment } from '../types/json.types';

/**
 * Safely parse JSON string with error handling
 */
export const safeJsonParse = (jsonString: string): { data: JsonValue | null; error: Error | null } => {
  try {
    const data = JSON.parse(jsonString);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
};

/**
 * Safely stringify JSON value with error handling
 */
export const safeJsonStringify = (value: JsonValue, indent?: number): { string: string; error: Error | null } => {
  try {
    const jsonString = JSON.stringify(value, null, indent);
    return { string: jsonString, error: null };
  } catch (error) {
    return { string: '', error: error as Error };
  }
};

/**
 * Get the type of a JSON value
 */
export const getJsonType = (value: JsonValue): JsonNodeType => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'null';
};

/**
 * Check if a JSON value is expandable (has children)
 */
export const isExpandable = (value: JsonValue): boolean => {
  const type = getJsonType(value);
  return type === 'object' || type === 'array';
};

/**
 * Get the size of a JSON value (number of children)
 */
export const getJsonSize = (value: JsonValue): number => {
  const type = getJsonType(value);
  if (type === 'array') return (value as JsonArray).length;
  if (type === 'object') return Object.keys(value as JsonObject).length;
  return 0;
};

/**
 * Get a display string for a JSON value
 */
export const getJsonValueDisplay = (value: JsonValue, type: JsonNodeType): string => {
  switch (type) {
    case 'string':
      return `"${value}"`;
    case 'null':
      return 'null';
    case 'object':
      return `Object(${Object.keys(value as JsonObject).length})`;
    case 'array':
      return `Array(${(value as JsonArray).length})`;
    default:
      return String(value);
  }
};

/**
 * Get a color class for a JSON value type
 */
export const getJsonTypeColor = (type: JsonNodeType): string => {
  switch (type) {
    case 'string':
      return 'text-green-400';
    case 'number':
      return 'text-blue-400';
    case 'boolean':
      return 'text-yellow-400';
    case 'null':
      return 'text-gray-500';
    case 'object':
      return 'text-purple-400';
    case 'array':
      return 'text-orange-400';
    default:
      return 'text-gray-300';
  }
};

/**
 * Parse a JSON path string into segments
 */
export const parseJsonPath = (path: string): JsonPath => {
  const segments: PathSegment[] = [];
  let isValid = true;

  try {
    if (!path) {
      return { segments: [], fullPath: '', isValid: true };
    }

    // Handle array indices and object properties
    const parts = path.split('.').filter(Boolean);
    
    for (const part of parts) {
      // Check if it's an array index
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
      } else if (/^\d+$/.test(part)) {
        // Array index
        segments.push({
          key: part,
          type: 'index',
          index: parseInt(part, 10),
        });
      } else {
        // Object property
        segments.push({
          key: part,
          type: 'property',
        });
      }
    }
  } catch {
    isValid = false;
  }

  return {
    segments,
    fullPath: path,
    isValid,
  };
};

/**
 * Build a JSON path string from segments
 */
export const buildJsonPath = (segments: PathSegment[]): string => {
  return segments
    .map(segment => {
      if (segment.type === 'index') {
        return `[${segment.index}]`;
      }
      return segment.key;
    })
    .join('.')
    .replace(/\.\[/g, '[');
};

/**
 * Get a value from a JSON object by path
 */
export const getValueByPath = (data: JsonValue, path: string): JsonValue | null => {
  try {
    if (!path) return data;

    const pathSegments = parseJsonPath(path);
    let current: JsonValue = data;

    for (const segment of pathSegments.segments) {
      if (segment.type === 'property') {
        if (typeof current === 'object' && current !== null) {
          current = (current as JsonObject)[segment.key];
        } else {
          return null;
        }
      } else if (segment.type === 'index') {
        if (Array.isArray(current)) {
          current = current[segment.index!];
        } else {
          return null;
        }
      }

      if (current === undefined) {
        return null;
      }
    }

    return current;
  } catch {
    return null;
  }
};

/**
 * Set a value in a JSON object by path
 */
export const setValueByPath = (data: JsonValue, path: string, value: JsonValue): JsonValue | null => {
  try {
    if (!path) return value;

    const pathSegments = parseJsonPath(path);
    const segments = pathSegments.segments;

    if (segments.length === 0) return value;

    // Create a deep copy of the data
    const result = JSON.parse(JSON.stringify(data));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = result;

    // Navigate to the parent of the target
    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i];
      
      if (segment.type === 'property') {
        if (typeof current !== 'object' || current === null) {
          current = {};
        }
        if (!(segment.key in current)) {
          const nextSegment = segments[i + 1];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (current as Record<string, any>)[segment.key] = nextSegment?.type === 'index' ? [] : {};
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        current = (current as Record<string, any>)[segment.key];
      } else if (segment.type === 'index') {
        if (!Array.isArray(current)) {
          current = [];
        }
        while (current.length <= segment.index!) {
          current.push(null);
        }
        current = current[segment.index!];
      }
    }

    // Set the final value
    const lastSegment = segments[segments.length - 1];
    if (lastSegment.type === 'property') {
      if (typeof current !== 'object' || current === null) {
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (current as Record<string, any>)[lastSegment.key] = value;
    } else if (lastSegment.type === 'index') {
      if (!Array.isArray(current)) {
        return null;
      }
      current[lastSegment.index!] = value;
    }

    return result;
  } catch {
    return null;
  }
};

/**
 * Delete a value from a JSON object by path
 */
export const deleteValueByPath = (data: JsonValue, path: string): JsonValue | null => {
  try {
    if (!path) return null;

    const pathSegments = parseJsonPath(path);
    const segments = pathSegments.segments;

    if (segments.length === 0) return null;

    // Create a deep copy of the data
    const result = JSON.parse(JSON.stringify(data));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = result;

    // Navigate to the parent of the target
    for (let i = 0; i < segments.length - 1; i++) {
      const segment = segments[i];
      
      if (segment.type === 'property') {
        if (typeof current !== 'object' || current === null) {
          return null;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        current = (current as Record<string, any>)[segment.key];
      } else if (segment.type === 'index') {
        if (!Array.isArray(current)) {
          return null;
        }
        current = current[segment.index!];
      }

      if (current === undefined) {
        return null;
      }
    }

    // Delete the final value
    const lastSegment = segments[segments.length - 1];
    if (lastSegment.type === 'property') {
      if (typeof current !== 'object' || current === null) {
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (current as Record<string, any>)[lastSegment.key];
    } else if (lastSegment.type === 'index') {
      if (!Array.isArray(current)) {
        return null;
      }
      current.splice(lastSegment.index!, 1);
    }

    return result;
  } catch {
    return null;
  }
};

/**
 * Build a tree structure from JSON data
 */
export const buildJsonTree = (
  data: JsonValue,
  path: string = '',
  level: number = 0,
  key: string = 'root'
): JsonNode => {
  const type = getJsonType(data);
  const node: JsonNode = {
    key,
    value: data,
    path,
    level,
    type,
    isExpanded: false,
    isSelected: false,
    isEditing: false,
  };

  if (isExpandable(data)) {
    if (type === 'array') {
      node.children = (data as JsonArray).map((item, index) => 
        buildJsonTree(item, `${path}[${index}]`, level + 1, index.toString())
      );
    } else if (type === 'object') {
      node.children = Object.entries(data as JsonObject).map(([key, value]) => 
        buildJsonTree(value, path ? `${path}.${key}` : key, level + 1, key)
      );
    }
  }

  return node;
};

/**
 * Convert a tree structure back to JSON data
 */
export const treeToJson = (node: JsonNode): JsonValue => {
  if (node.type === 'array') {
    return node.children?.map(child => treeToJson(child)) || [];
  } else if (node.type === 'object') {
    const obj: JsonObject = {};
    node.children?.forEach(child => {
      obj[child.key] = treeToJson(child);
    });
    return obj;
  } else {
    return node.value;
  }
};

/**
 * Find a node in the tree by path
 */
export const findNodeByPath = (node: JsonNode, targetPath: string): JsonNode | null => {
  if (node.path === targetPath) return node;
  
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeByPath(child, targetPath);
      if (found) return found;
    }
  }
  
  return null;
};

/**
 * Get all paths in the tree
 */
export const getAllPaths = (node: JsonNode): string[] => {
  const paths = [node.path];
  
  if (node.children) {
    node.children.forEach(child => {
      paths.push(...getAllPaths(child));
    });
  }
  
  return paths;
};

/**
 * Validate JSON path syntax
 */
export const isValidJsonPath = (path: string): boolean => {
  try {
    parseJsonPath(path);
    return true;
  } catch {
    return false;
  }
};

/**
 * Escape JSON property keys for display
 */
export const escapeJsonKey = (key: string): string => {
  return key.replace(/["\\]/g, '\\$&');
};

/**
 * Unescape JSON property keys
 */
export const unescapeJsonKey = (key: string): string => {
  return key.replace(/\\["\\]/g, match => match.slice(1));
};

/**
 * Format JSON value for editing
 */
export const formatValueForEdit = (value: JsonValue, type: JsonNodeType): string => {
  switch (type) {
    case 'string':
      return value as string;
    case 'null':
      return 'null';
    case 'boolean':
      return String(value);
    case 'number':
      return String(value);
    default:
      return JSON.stringify(value);
  }
};

/**
 * Parse edited value back to JSON
 */
export const parseEditedValue = (value: string, targetType?: JsonNodeType): JsonValue => {
  // Try to parse as JSON first
  try {
    return JSON.parse(value);
  } catch {
    // Fallback to type-specific parsing
    if (targetType === 'string') {
      return value;
    } else if (targetType === 'number') {
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    } else if (targetType === 'boolean') {
      return value.toLowerCase() === 'true';
    } else if (targetType === 'null' || value === 'null') {
      return null;
    }
    
    // Default to string
    return value;
  }
};

/**
 * Check if two JSON values are deeply equal
 */
export const isJsonEqual = (a: JsonValue, b: JsonValue): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};

/**
 * Get a hash for a JSON value (for comparison)
 */
export const getJsonHash = (value: JsonValue): string => {
  return btoa(JSON.stringify(value)).slice(0, 8);
};