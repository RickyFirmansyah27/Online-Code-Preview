import { JsonValue, JsonNodeType } from '../types/json.types';
import { TREE_ICONS } from '../constants/treeConstants';

/**
 * Gets the appropriate icon for a node based on its type and expansion state
 */
export const getNodeIcon = (type: JsonNodeType, isExpanded: boolean): string => {
  switch (type) {
    case 'object':
      return isExpanded ? TREE_ICONS.OBJECT_EXPANDED : TREE_ICONS.OBJECT_COLLAPSED;
    case 'array':
      return isExpanded ? TREE_ICONS.ARRAY_EXPANDED : TREE_ICONS.ARRAY_COLLAPSED;
    case 'string':
      return TREE_ICONS.STRING;
    case 'number':
      return TREE_ICONS.NUMBER;
    case 'boolean':
      return TREE_ICONS.BOOLEAN;
    case 'null':
      return TREE_ICONS.NULL;
    default:
      return TREE_ICONS.UNKNOWN;
  }
};

/**
 * Gets the display string for a value based on its type
 */
export const getValueDisplay = (value: JsonValue, type: JsonNodeType): string => {
  switch (type) {
    case 'string':
      return `"${value}"`;
    case 'null':
      return 'null';
    case 'object':
      return ''; // Remove Object(length) display
    case 'array':
      return ''; // Remove Array(length) display
    default:
      return String(value);
  }
};

/**
 * Gets the CSS color class for a value based on its type
 */
export const getValueColor = (type: JsonNodeType): string => {
  switch (type) {
    case 'string':
      return 'text-green-400';
    case 'number':
      return 'text-blue-400';
    case 'boolean':
      return 'text-yellow-400';
    case 'null':
      return 'text-gray-500';
    default:
      return 'text-gray-300';
  }
};

/**
 * Parses a string value into the appropriate JSON value type
 */
export const parseValue = (inputValue: string, targetType: JsonNodeType): JsonValue => {
  const trimmedValue = inputValue.trim();
  
  // Handle empty string case
  if (trimmedValue === '') {
    return targetType === 'string' ? '' : null;
  }
  
  // Handle explicit null
  if (trimmedValue === 'null') {
    return null;
  }
  
  // Handle boolean values
  if (trimmedValue === 'true') {
    return true;
  }
  
  if (trimmedValue === 'false') {
    return false;
  }
  
  // Handle numbers
  if (!isNaN(Number(trimmedValue))) {
    return Number(trimmedValue);
  }
  
  // Default to string for other cases
  return inputValue;
};

/**
 * Validates if a value can be parsed to the target type
 */
export const validateValueParse = (inputValue: string, targetType: JsonNodeType): { isValid: boolean; error?: string } => {
  try {
    const parsedValue = parseValue(inputValue, targetType);
    
    // Additional validation for specific types
    if (targetType === 'number' && isNaN(Number(parsedValue))) {
      return { isValid: false, error: 'Invalid number format' };
    }
    
    if (targetType === 'boolean' && typeof parsedValue !== 'boolean') {
      return { isValid: false, error: 'Invalid boolean value (use true or false)' };
    }
    
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

/**
 * Gets the size display for objects and arrays
 */
export const getSizeDisplay = (value: JsonValue, type: JsonNodeType): string => {
  if (type === 'object' && value && typeof value === 'object' && !Array.isArray(value)) {
    return `{${Object.keys(value).length}}`;
  }
  
  if (type === 'array' && Array.isArray(value)) {
    return `[${value.length}]`;
  }
  
  return '';
};

/**
 * Checks if a node type can have children
 */
export const hasChildren = (type: JsonNodeType): boolean => {
  return type === 'object' || type === 'array';
};

/**
 * Checks if a node type can be edited inline
 */
export const isEditable = (type: JsonNodeType): boolean => {
  return type !== 'object' && type !== 'array';
};