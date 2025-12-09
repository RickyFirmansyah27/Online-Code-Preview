/**
 * Validation utilities for JSON tree menu
 */

import { JsonValue, JsonObject, ValidationResult, ValidationError, ValidationWarning, ValidationSuggestion, JsonNode } from '../types/json.types';
import { safeJsonParse, getJsonType } from './jsonUtils';

/**
 * Validation rule interface
 */
export interface ValidationRule {
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  validate: (value: JsonValue, path: string, options?: ValidationOptions) => ValidationError[];
}

/**
 * Validation options
 */
export interface ValidationOptions {
  strictMode?: boolean;
  maxDepth?: number;
  maxArrayLength?: number;
  maxObjectSize?: number;
  allowedTypes?: string[];
  forbiddenKeys?: string[];
  requiredKeys?: string[];
  customRules?: ValidationRule[];
}

/**
 * Default validation options
 */
export const DEFAULT_VALIDATION_OPTIONS: ValidationOptions = {
  strictMode: false,
  maxDepth: 10,
  maxArrayLength: 1000,
  maxObjectSize: 1000,
  allowedTypes: ['string', 'number', 'boolean', 'null', 'object', 'array'],
  forbiddenKeys: [],
  requiredKeys: [],
  customRules: [],
};

/**
 * Built-in validation rules
 */
export const BUILT_IN_VALIDATION_RULES: ValidationRule[] = [
  {
    name: 'syntax-error',
    description: 'JSON syntax validation',
    severity: 'error',
    validate: (value: JsonValue, path: string): ValidationError[] => {
      const errors: ValidationError[] = [];
      
      try {
        JSON.stringify(value);
      } catch {
        errors.push({
          path,
          message: 'Invalid JSON syntax',
          code: 'SYNTAX_ERROR',
          severity: 'error',
        });
      }
      
      return errors;
    },
  },
  
  {
    name: 'circular-reference',
    description: 'Circular reference detection',
    severity: 'error',
    validate: (value: JsonValue, path: string): ValidationError[] => {
      const errors: ValidationError[] = [];
      const seen = new WeakSet();
      
      const checkCircular = (obj: JsonValue, currentPath: string): boolean => {
        if (typeof obj === 'object' && obj !== null) {
          if (seen.has(obj)) {
            errors.push({
              path: currentPath,
              message: 'Circular reference detected',
              code: 'CIRCULAR_REFERENCE',
              severity: 'error',
            });
            return true;
          }
          
          seen.add(obj);
          
          if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
              if (checkCircular(obj[i], `${currentPath}[${i}]`)) {
                return true;
              }
            }
          } else {
            for (const [key, val] of Object.entries(obj)) {
              if (checkCircular(val, `${currentPath}.${key}`)) {
                return true;
              }
            }
          }
        }
        
        return false;
      };
      
      checkCircular(value, path);
      
      return errors;
    },
  },
  
  {
    name: 'depth-limit',
    description: 'Maximum nesting depth validation',
    severity: 'warning',
    validate: (value: JsonValue, path: string, options?: ValidationOptions): ValidationError[] => {
      const errors: ValidationError[] = [];
      const maxDepth = options?.maxDepth || DEFAULT_VALIDATION_OPTIONS.maxDepth;
      
      const checkDepth = (obj: JsonValue, currentPath: string, depth: number): void => {
        if (depth > (maxDepth!)) {
          errors.push({
            path: currentPath,
            message: `Maximum nesting depth (${maxDepth}) exceeded`,
            code: 'MAX_DEPTH_EXCEEDED',
            severity: 'warning',
          });
          return;
        }
        
        if (typeof obj === 'object' && obj !== null) {
          if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
              checkDepth(obj[i], `${currentPath}[${i}]`, depth + 1);
            }
          } else {
            for (const [key, val] of Object.entries(obj)) {
              checkDepth(val, `${currentPath}.${key}`, depth + 1);
            }
          }
        }
      };
      
      checkDepth(value, path, 0);
      
      return errors;
    },
  },
  
  {
    name: 'array-length',
    description: 'Array length validation',
    severity: 'warning',
    validate: (value: JsonValue, path: string, options?: ValidationOptions): ValidationError[] => {
      const errors: ValidationError[] = [];
      const maxLength = options?.maxArrayLength || DEFAULT_VALIDATION_OPTIONS.maxArrayLength;
      
      if (Array.isArray(value) && value.length > (maxLength!)) {
        errors.push({
          path,
          message: `Array length (${value.length}) exceeds maximum (${maxLength})`,
          code: 'ARRAY_TOO_LONG',
          severity: 'warning',
        });
      }
      
      return errors;
    },
  },
  
  {
    name: 'object-size',
    description: 'Object size validation',
    severity: 'warning',
    validate: (value: JsonValue, path: string, options?: ValidationOptions): ValidationError[] => {
      const errors: ValidationError[] = [];
      const maxSize = options?.maxObjectSize || DEFAULT_VALIDATION_OPTIONS.maxObjectSize;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const size = Object.keys(value).length;
        if (size > (maxSize!)) {
          errors.push({
            path,
            message: `Object size (${size}) exceeds maximum (${maxSize})`,
            code: 'OBJECT_TOO_LARGE',
            severity: 'warning',
          });
        }
      }
      
      return errors;
    },
  },
  
  {
    name: 'forbidden-keys',
    description: 'Forbidden key validation',
    severity: 'warning',
    validate: (value: JsonValue, path: string, options?: ValidationOptions): ValidationError[] => {
      const errors: ValidationError[] = [];
      const forbiddenKeys = options?.forbiddenKeys || DEFAULT_VALIDATION_OPTIONS.forbiddenKeys;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        for (const key of Object.keys(value)) {
          if ((forbiddenKeys || []).includes(key)) {
            errors.push({
              path: `${path}.${key}`,
              message: `Forbidden key "${key}" found`,
              code: 'FORBIDDEN_KEY',
              severity: 'warning',
            });
          }
        }
      }
      
      return errors;
    },
  },
  
  {
    name: 'required-keys',
    description: 'Required key validation',
    severity: 'error',
    validate: (value: JsonValue, path: string, options?: ValidationOptions): ValidationError[] => {
      const errors: ValidationError[] = [];
      const requiredKeys = options?.requiredKeys || DEFAULT_VALIDATION_OPTIONS.requiredKeys;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        const objectKeys = Object.keys(value);
        
        for (const requiredKey of (requiredKeys || [])) {
          if (!objectKeys.includes(requiredKey)) {
            errors.push({
              path,
              message: `Required key "${requiredKey}" is missing`,
              code: 'REQUIRED_KEY_MISSING',
              severity: 'error',
            });
          }
        }
      }
      
      return errors;
    },
  },
];

/**
 * Validate JSON string
 */
export const validateJsonString = (jsonString: string, options: ValidationOptions = DEFAULT_VALIDATION_OPTIONS): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // Parse JSON
  const { data, error: parseError } = safeJsonParse(jsonString);
  
  if (parseError || data === null) {
    errors.push({
      path: '',
      message: parseError?.message || 'Invalid JSON',
      code: 'PARSE_ERROR',
      severity: 'error',
      line: 1,
      column: 1,
    });
    
    return {
      isValid: false,
      errors,
      warnings,
    };
  }
  
  return validateJsonValue(data, '', options);
};

/**
 * Validate JSON value
 */
export const validateJsonValue = (value: JsonValue, path: string = '', options: ValidationOptions = DEFAULT_VALIDATION_OPTIONS): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // Check allowed types
  if (options.allowedTypes && options.allowedTypes.length > 0) {
    const type = getJsonType(value);
    if (!options.allowedTypes.includes(type)) {
      errors.push({
        path,
        message: `Type "${type}" is not allowed`,
        code: 'TYPE_NOT_ALLOWED',
        severity: 'error',
      });
    }
  }
  
  // Run built-in validation rules
  const allRules = [...BUILT_IN_VALIDATION_RULES, ...(options.customRules || [])];
  
  for (const rule of allRules) {
    try {
      const ruleErrors = rule.validate(value, path);
      
      for (const ruleError of ruleErrors) {
        if (ruleError.severity === 'error') {
          errors.push(ruleError);
        } else if (ruleError.severity === 'warning') {
          warnings.push(ruleError as ValidationWarning);
        }
      }
    } catch {
      // Skip rule if it throws an error
      continue;
    }
  }
  
  // Recursively validate nested objects and arrays
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const nestedResult = validateJsonValue(item, `${path}[${index}]`, options);
        errors.push(...nestedResult.errors);
        warnings.push(...nestedResult.warnings);
      });
    } else {
      for (const [key, val] of Object.entries(value)) {
        const nestedResult = validateJsonValue(val, path ? `${path}.${key}` : key, options);
        errors.push(...nestedResult.errors);
        warnings.push(...nestedResult.warnings);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate JSON tree node
 */
export const validateJsonNode = (node: JsonNode, options: ValidationOptions = DEFAULT_VALIDATION_OPTIONS): ValidationResult => {
  return validateJsonValue(node.value, node.path, options);
};

/**
 * Get validation suggestions for fixing errors
 */
export const getValidationSuggestions = (validationResult: ValidationResult): ValidationSuggestion[] => {
  const suggestions: ValidationSuggestion[] = [];
  
  for (const error of validationResult.errors) {
    switch (error.code) {
      case 'PARSE_ERROR':
        suggestions.push({
          path: error.path,
          message: 'Fix JSON syntax errors',
          type: 'modification',
        });
        break;
        
      case 'REQUIRED_KEY_MISSING':
        const keyMatch = error.message.match(/Required key "([^"]+)" is missing/);
        if (keyMatch) {
          suggestions.push({
            path: error.path,
            message: `Add missing key "${keyMatch[1]}"`,
            type: 'addition',
            suggestedValue: null,
          });
        }
        break;
        
      case 'FORBIDDEN_KEY':
        const forbiddenKeyMatch = error.message.match(/Forbidden key "([^"]+)" found/);
        if (forbiddenKeyMatch) {
          suggestions.push({
            path: error.path,
            message: `Remove forbidden key "${forbiddenKeyMatch[1]}"`,
            type: 'removal',
          });
        }
        break;
        
      case 'MAX_DEPTH_EXCEEDED':
        suggestions.push({
          path: error.path,
          message: 'Flatten nested structure',
          type: 'modification',
        });
        break;
        
      case 'ARRAY_TOO_LONG':
        suggestions.push({
          path: error.path,
          message: 'Consider pagination or splitting array',
          type: 'modification',
        });
        break;
        
      case 'OBJECT_TOO_LARGE':
        suggestions.push({
          path: error.path,
          message: 'Consider splitting into smaller objects',
          type: 'modification',
        });
        break;
    }
  }
  
  return suggestions;
};

/**
 * Auto-fix validation errors when possible
 */
export const autoFixValidationErrors = (jsonString: string, validationResult: ValidationResult): { fixed: string; fixedErrors: ValidationError[] } => {
  let fixed = jsonString;
  const fixedErrors: ValidationError[] = [];
  
  for (const error of validationResult.errors) {
    switch (error.code) {
      case 'PARSE_ERROR':
        // Try to fix common JSON syntax errors
        fixed = fixed
          .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
          .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Add quotes to unquoted keys
          .replace(/'/g, '"'); // Replace single quotes with double quotes
        
        // Check if the fix worked
        const { data } = safeJsonParse(fixed);
        if (data !== null) {
          fixedErrors.push(error);
        }
        break;
        
      default:
        // Other errors require manual intervention
        break;
    }
  }
  
  return { fixed, fixedErrors };
};

/**
 * Validate JSON schema compliance
 */
export const validateJsonSchema = (data: JsonValue, schema: Record<string, unknown>): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // Basic schema validation (simplified)
  const validateAgainstSchema = (value: JsonValue, schemaPart: Record<string, unknown>, path: string): void => {
    if (!schemaPart) return;
    
    // Type validation
    if (schemaPart.type) {
      const expectedType = schemaPart.type;
      const actualType = getJsonType(value);
      
      if (expectedType !== actualType) {
        errors.push({
          path,
          message: `Expected type "${expectedType}", got "${actualType}"`,
          code: 'SCHEMA_TYPE_MISMATCH',
          severity: 'error',
        });
      }
    }
    
    // Required properties
    if (schemaPart.required && typeof value === 'object' && value !== null && !Array.isArray(value)) {
      for (const requiredProp of (schemaPart.required as string[]) || []) {
        if (!(requiredProp in value)) {
          errors.push({
            path: `${path}.${requiredProp}`,
            message: `Required property "${requiredProp}" is missing`,
            code: 'SCHEMA_REQUIRED_MISSING',
            severity: 'error',
          });
        }
      }
    }
    
    // Properties validation
    if (schemaPart.properties && typeof value === 'object' && value !== null && !Array.isArray(value)) {
      for (const [prop, propSchema] of Object.entries(schemaPart.properties)) {
        if (prop in value) {
          validateAgainstSchema((value as JsonObject)[prop], propSchema, `${path}.${prop}`);
        }
      }
    }
    
    // Array items validation
    if (schemaPart.items && Array.isArray(value)) {
      value.forEach((item, index) => {
        validateAgainstSchema(item, schemaPart.items as Record<string, unknown>, `${path}[${index}]`);
      });
    }
  };
  
  validateAgainstSchema(data, schema, '');
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Get validation summary
 */
export const getValidationSummary = (validationResult: ValidationResult) => {
  return {
    isValid: validationResult.isValid,
    errorCount: validationResult.errors.length,
    warningCount: validationResult.warnings.length,
    severity: validationResult.errors.length > 0 ? 'error' : 
               validationResult.warnings.length > 0 ? 'warning' : 'success',
    hasErrors: validationResult.errors.length > 0,
    hasWarnings: validationResult.warnings.length > 0,
  };
};