/**
 * JSON Tree Type Definitions
 * Provides type safety for JSON tree operations
 */

// Base JSON value types
export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonArray | JsonObject;

// JSON Node types
export type JsonNodeType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';

/**
 * Represents a node in the JSON tree structure
 */
export interface JsonNode {
    key: string;
    value: JsonValue;
    path: string;
    level: number;
    type: JsonNodeType;
    isExpanded?: boolean;
    children?: JsonNode[];
}

/**
 * File type categories for JSON files
 */
export type JsonFileType = 'config' | 'data' | 'schema' | 'other';

/**
 * Represents a JSON file in the application
 */
export interface JsonFile {
    id: string;
    name: string;
    content: string;
    parsedData?: JsonValue;
    size: number;
    lastModified: Date;
    type: JsonFileType;
    isDirty: boolean;
    isValid: boolean;
}

/**
 * Validation result for JSON content
 */
export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
}

export interface ValidationError {
    path: string;
    message: string;
    line?: number;
    column?: number;
}

export interface ValidationWarning {
    path: string;
    message: string;
    line?: number;
    column?: number;
}

/**
 * Tree configuration options
 */
export interface TreeConfig {
    defaultExpanded: boolean;
    maxDepth: number;
    showLineNumbers: boolean;
    showDataTypes: boolean;
    sortKeys: boolean;
    indentSize: number;
    theme: 'light' | 'dark';
}

/**
 * Edit operation types
 */
export type EditOperationType = 'add' | 'update' | 'delete' | 'move' | 'copy';

export interface JsonEditOperation {
    type: EditOperationType;
    path: string;
    oldValue?: JsonValue;
    newValue?: JsonValue;
    targetPath?: string;
    timestamp: Date;
}

/**
 * Search result for tree search operations
 */
export interface SearchResult {
    path: string;
    key: string;
    value: JsonValue;
    matchType: 'key' | 'value' | 'both';
    node: JsonNode;
}

/**
 * View modes for the tree
 */
export type TreeViewMode = 'tree' | 'raw' | 'graph' | 'table';

/**
 * Edit modes for the tree
 */
export type EditMode = 'view' | 'edit' | 'readonly';

/**
 * Path segment for navigation
 */
export interface PathSegment {
    key: string;
    index?: number;
    type: JsonNodeType;
    path: string;
}

/**
 * Export options for JSON content
 */
export interface ExportOptions {
    format: 'json' | 'minified' | 'yaml' | 'csv';
    indentation?: number;
    includeComments?: boolean;
    encoding?: 'utf-8' | 'utf-16';
}

/**
 * Import options for JSON content
 */
export interface ImportOptions {
    format: 'json' | 'yaml' | 'csv';
    validate?: boolean;
    mergeStrategy?: 'replace' | 'merge' | 'append';
    encoding?: 'utf-8' | 'utf-16';
}
