// Main components
export { default as JsonTreeMenu } from './JsonTreeMenu';
export { JsonTreeMenu as JsonTreeMenuComponent } from './JsonTreeMenu';

// Components - use the new modular exports
export * from './components';

// Keep backward compatibility for named exports
export { default as JsonTreeNode } from './components/JsonTreeNode';
export { default as JsonTreeNodeComponent } from './components/JsonTreeNode';

export { default as JsonTreeSearch } from './components/JsonTreeSearch';
export { default as JsonTreeSearchComponent } from './components/JsonTreeSearch';

export { default as JsonTreeBreadcrumb } from './components/JsonTreeBreadcrumb';
export { default as JsonTreeBreadcrumbComponent } from './components/JsonTreeBreadcrumb';

export { default as JsonTreeValidation } from './components/JsonTreeValidation';
export { default as JsonTreeValidationComponent } from './components/JsonTreeValidation';

export { default as JsonTreeContextMenu } from './components/JsonTreeContextMenu';
export { default as JsonTreeContextMenuComponent } from './components/JsonTreeContextMenu';

export { default as JsonTreeExport } from './components/JsonTreeExport';
export { default as JsonTreeExportComponent } from './components/JsonTreeExport';

// Hooks
export { useJsonTree } from './hooks/useJsonTree';

// Types
export type {
  JsonFile,
  JsonNode,
  JsonValue,
  JsonNodeType,
  TreeViewMode,
  EditMode,
  ExportOptions,
  ImportOptions,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  SearchResult,
  SearchMatch,
  TreeConfig,
  JsonTreeMenuProps,
  JsonTreeNodeProps,
  JsonTreeSearchProps,
  JsonTreeBreadcrumbProps,
  JsonTreeValidationProps,
  JsonTreeContextMenuProps,
  JsonTreeExportProps,
  UseJsonTreeReturn,
} from './types/json.types';

// Constants
export { DEFAULT_TREE_CONFIG } from './constants/treeConstants';

// Utilities - use the new modular exports
export * from './utils';

// Keep backward compatibility
export * from './utils/jsonUtils';
export * from './utils/searchUtils';
export * from './utils/validationUtils';
export * from './utils/exportUtils';