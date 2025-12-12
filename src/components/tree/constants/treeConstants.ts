/**
 * Tree configuration constants
 */

export const DEFAULT_TREE_CONFIG = {
  defaultExpanded: false,
  maxDepth: 10,
  showLineNumbers: false,
  showTypes: true,
  showSizes: false,
  enableDragDrop: false,
  enableMultiSelect: false,
  animationDuration: 200,
  searchDebounceMs: 300,
  virtualScrolling: false,
  virtualItemHeight: 32,
};

export const TREE_ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
};

export const TREE_NODE_HEIGHT = {
  COMPACT: 24,
  NORMAL: 32,
  COMFORTABLE: 40,
};

export const TREE_INDENT_SIZE = {
  SMALL: 16,
  MEDIUM: 20,
  LARGE: 24,
};

export const TREE_MAX_DEPTH = {
  SHALLOW: 5,
  NORMAL: 10,
  DEEP: 20,
  UNLIMITED: -1,
};

export const TREE_VIEW_MODES = {
  TREE: 'tree',
  RAW: 'raw',
  EXPANDED: 'expanded',
} as const;

export const TREE_EDIT_MODES = {
  INLINE: 'inline',
  MODAL: 'modal',
  EXTERNAL: 'external',
} as const;

export const TREE_NODE_TYPES = {
  OBJECT: 'object',
  ARRAY: 'array',
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  NULL: 'null',
} as const;

export const TREE_EXPORT_FORMATS = {
  JSON: 'json',
  YAML: 'yaml',
  XML: 'xml',
  CSV: 'csv',
  PROPERTIES: 'properties',
} as const;

export const TREE_IMPORT_FORMATS = {
  JSON: 'json',
  YAML: 'yaml',
  XML: 'xml',
  CSV: 'csv',
  PROPERTIES: 'properties',
} as const;

export const TREE_VALIDATION_SEVERITY = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export const TREE_EDIT_OPERATIONS = {
  UPDATE: 'update',
  ADD: 'add',
  DELETE: 'delete',
  MOVE: 'move',
  COPY: 'copy',
} as const;

export const TREE_CLIPBOARD_TYPES = {
  NODE: 'node',
  VALUE: 'value',
  PATH: 'path',
} as const;

export const TREE_DROP_POSITIONS = {
  BEFORE: 'before',
  AFTER: 'after',
  INSIDE: 'inside',
} as const;

export const TREE_PATH_SEGMENT_TYPES = {
  PROPERTY: 'property',
  INDEX: 'index',
} as const;

export const TREE_FILE_TYPES = {
  CONFIG: 'config',
  DATA: 'data',
  SCHEMA: 'schema',
  OTHER: 'other',
} as const;

export const TREE_CONFIG_FILE_PATTERNS = [
  'package.json',
  'tsconfig.json',
  'jsconfig.json',
  'webpack.config.js',
  'vite.config.js',
  'tailwind.config.js',
  '.eslintrc.json',
  '.prettierrc.json',
  'babel.config.json',
  'jest.config.json',
];

export const TREE_THEME_COLORS = {
  BACKGROUND: '#12121a',
  BACKGROUND_HOVER: '#1e1e2e',
  BORDER: 'rgba(255, 255, 255, 0.05)',
  BORDER_HOVER: 'rgba(255, 255, 255, 0.1)',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#9ca3af',
  TEXT_MUTED: '#6b7280',
  ACCENT: '#3b82f6',
  ACCENT_HOVER: '#2563eb',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#06b6d4',
};

export const TREE_ICONS = {
  OBJECT_EXPANDED: '📂',
  OBJECT_COLLAPSED: '📁',
  ARRAY_EXPANDED: '📋',
  ARRAY_COLLAPSED: '📄',
  STRING: '📝',
  NUMBER: '🔢',
  BOOLEAN: '☑️',
  NULL: '⭕',
  UNKNOWN: '❓',
  KEY: '🔑',
  VALUE: '💎',
  SEARCH: '🔍',
  FILTER: '🔽',
  COPY: '📋',
  PASTE: '📋',
  EDIT: '✏️',
  DELETE: '🗑️',
  ADD: '➕',
  SAVE: '💾',
  EXPORT: '📤',
  IMPORT: '📥',
  VALIDATE: '✅',
  ERROR: '❌',
  WARNING: '⚠️',
  INFO: 'ℹ️',
};

export const TREE_SHORTCUTS = {
  TOGGLE_NODE: 'Space',
  EDIT_NODE: 'F2',
  DELETE_NODE: 'Delete',
  COPY_NODE: 'Ctrl+C',
  PASTE_NODE: 'Ctrl+V',
  UNDO: 'Ctrl+Z',
  REDO: 'Ctrl+Y',
  SAVE: 'Ctrl+S',
  SEARCH: 'Ctrl+F',
  EXPAND_ALL: 'Ctrl+E',
  COLLAPSE_ALL: 'Ctrl+W',
  SELECT_ALL: 'Ctrl+A',
  MULTI_SELECT: 'Ctrl+Click',
  RANGE_SELECT: 'Shift+Click',
  CONTEXT_MENU: 'Right Click',
  FOCUS_SEARCH: 'Ctrl+/',
} as const;

export const TREE_BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE: 1280,
} as const;

export const TREE_PERFORMANCE_LIMITS = {
  MAX_NODES: 10000,
  MAX_SEARCH_RESULTS: 1000,
  MAX_UNDO_STACK: 50,
  MAX_CLIPBOARD_SIZE: 1024 * 1024, // 1MB
  DEBOUNCE_DELAY: 300,
  VIRTUAL_SCROLL_THRESHOLD: 1000,
} as const;

export const TREE_ERROR_CODES = {
  PARSE_ERROR: 'PARSE_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  MEMORY_ERROR: 'MEMORY_ERROR',
  INVALID_PATH: 'INVALID_PATH',
  INVALID_VALUE: 'INVALID_VALUE',
  OPERATION_FAILED: 'OPERATION_FAILED',
} as const;

export const TREE_SUCCESS_MESSAGES = {
  FILE_LOADED: 'File loaded successfully',
  FILE_SAVED: 'File saved successfully',
  NODE_ADDED: 'Node added successfully',
  NODE_DELETED: 'Node deleted successfully',
  NODE_UPDATED: 'Node updated successfully',
  NODE_MOVED: 'Node moved successfully',
  NODE_COPIED: 'Node copied successfully',
  EXPORT_SUCCESS: 'Export completed successfully',
  IMPORT_SUCCESS: 'Import completed successfully',
  VALIDATION_SUCCESS: 'Validation completed successfully',
} as const;

export const TREE_ERROR_MESSAGES = {
  PARSE_ERROR: 'Failed to parse JSON file',
  VALIDATION_ERROR: 'JSON validation failed',
  FILE_NOT_FOUND: 'File not found',
  PERMISSION_DENIED: 'Permission denied',
  NETWORK_ERROR: 'Network error occurred',
  TIMEOUT_ERROR: 'Operation timed out',
  MEMORY_ERROR: 'Insufficient memory',
  INVALID_PATH: 'Invalid JSON path',
  INVALID_VALUE: 'Invalid JSON value',
  OPERATION_FAILED: 'Operation failed',
  UNSUPPORTED_FORMAT: 'Unsupported file format',
  FILE_TOO_LARGE: 'File too large to process',
  QUOTA_EXCEEDED: 'Storage quota exceeded',
} as const;