/**
 * Core JSON value types supported by the tree menu
 */
export type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | JsonObject 
  | JsonArray;

/**
 * JSON object type
 */
export interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * JSON array type
 */
export type JsonArray = JsonValue[];

/**
 * JSON file metadata and content
 */
export interface JsonFile {
  id: string;
  name: string;
  content: string;
  parsedData?: JsonValue;
  size: number;
  lastModified: Date;
  url?: string;
  type: 'config' | 'data' | 'schema' | 'other';
  isDirty?: boolean;
  isValid?: boolean;
}

/**
 * Tree node representation
 */
export interface JsonNode {
  key: string;
  value: JsonValue;
  path: string;
  level: number;
  type: JsonNodeType;
  isExpanded?: boolean;
  isSelected?: boolean;
  isEditing?: boolean;
  children?: JsonNode[];
  parent?: JsonNode;
  metadata?: NodeMetadata;
}

/**
 * Node types in the JSON tree
 */
export type JsonNodeType = 
  | 'object'
  | 'array' 
  | 'string'
  | 'number'
  | 'boolean'
  | 'null';

/**
 * Additional metadata for nodes
 */
export interface NodeMetadata {
  index?: number; // For array items
  originalValue?: JsonValue; // For edit tracking
  validationErrors?: ValidationError[];
  isModified?: boolean;
  isAdded?: boolean;
  isDeleted?: boolean;
}

/**
 * Search result representation
 */
export interface SearchResult {
  node: JsonNode;
  matches: SearchMatch[];
  score: number;
}

/**
 * Individual search match within a node
 */
export interface SearchMatch {
  path: string;
  key: string;
  value: string;
  keyMatch?: boolean;
  valueMatch?: boolean;
  startIndex?: number;
  endIndex?: number;
}

/**
 * JSON path representation
 */
export interface JsonPath {
  segments: PathSegment[];
  fullPath: string;
  isValid: boolean;
}

/**
 * Individual path segment
 */
export interface PathSegment {
  key: string;
  type: 'property' | 'index';
  index?: number;
}

/**
 * Edit operation types
 */
export type EditOperation = 
  | 'update'
  | 'add'
  | 'delete'
  | 'move'
  | 'copy';

/**
 * Edit operation details
 */
export interface JsonEditOperation {
  type: EditOperation;
  path: string;
  oldValue?: JsonValue;
  newValue?: JsonValue;
  newPath?: string; // For move operations
  timestamp: Date;
  userId?: string;
}

/**
 * Tree view modes
 */
export type TreeViewMode =
  | 'tree'      // Hierarchical tree view
  | 'nodes'     // Nodes graph view
  | 'raw'       // Raw JSON text
  | 'expanded'; // Fully expanded view

/**
 * Edit modes
 */
export type EditMode = 
  | 'inline'    // Edit directly in the tree
  | 'modal'     // Edit in a modal dialog
  | 'external'; // Edit in external editor

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions?: ValidationSuggestion[];
}

/**
 * Validation error details
 */
export interface ValidationError {
  path: string;
  message: string;
  code: string;
  severity: 'error' | 'warning' | 'info';
  line?: number;
  column?: number;
  fix?: ValidationFix;
}

/**
 * Validation warning details
 */
export interface ValidationWarning extends Omit<ValidationError, 'severity'> {
  severity: 'warning';
}

/**
 * Validation suggestion
 */
export interface ValidationSuggestion {
  path: string;
  message: string;
  type: 'addition' | 'removal' | 'modification';
  suggestedValue?: JsonValue;
}

/**
 * Auto-fix suggestion
 */
export interface ValidationFix {
  type: 'auto' | 'manual';
  description: string;
  apply?: () => Promise<void>;
}

/**
 * Export options
 */
export interface ExportOptions {
  format: 'json' | 'yaml' | 'xml' | 'csv' | 'properties';
  indentation?: number;
  sortKeys?: boolean;
  includeMetadata?: boolean;
  filter?: (path: string, value: JsonValue) => boolean;
}

/**
 * Import options
 */
export interface ImportOptions {
  format: 'json' | 'yaml' | 'xml' | 'csv' | 'properties';
  mergeStrategy?: 'replace' | 'merge' | 'append';
  validateOnImport?: boolean;
  transform?: (value: JsonValue) => JsonValue;
}

/**
 * Tree configuration
 */
export interface TreeConfig {
  defaultExpanded: boolean;
  maxDepth: number;
  showLineNumbers: boolean;
  showTypes: boolean;
  showSizes: boolean;
  enableDragDrop: boolean;
  enableMultiSelect: boolean;
  animationDuration: number;
  searchDebounceMs: number;
  virtualScrolling: boolean;
  virtualItemHeight: number;
}

/**
 * Context menu action
 */
export interface ContextMenuAction {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  submenu?: ContextMenuAction[];
  action: (node: JsonNode, context: MenuContext) => void | Promise<void>;
}

/**
 * Context menu context
 */
export interface MenuContext {
  event: MouseEvent;
  tree: JsonTreeMenuRef;
  selectedNodes: JsonNode[];
  clipboard?: JsonValue;
}

/**
 * Tree menu reference
 */
export interface JsonTreeMenuRef {
  expandAll: () => void;
  collapseAll: () => void;
  selectNode: (path: string) => void;
  expandToPath: (path: string) => void;
  search: (query: string) => SearchResult[];
  export: (options: ExportOptions) => Promise<string>;
  import: (data: string, options: ImportOptions) => Promise<void>;
  validate: () => ValidationResult;
  save: () => Promise<void>;
  focus: () => void;
}

/**
 * Keyboard event handler
 */
export type KeyboardHandler = (event: KeyboardEvent, context: KeyboardContext) => boolean;

/**
 * Keyboard event context
 */
export interface KeyboardContext {
  node: JsonNode | null;
  selectedNodes: JsonNode[];
  isEditing: boolean;
  searchQuery: string;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  renderTime: number;
  nodeCount: number;
  visibleNodes: number;
  memoryUsage: number;
  searchTime: number;
}

/**
 * Tree event types
 */
export interface TreeEvents {
  onNodeSelect: (node: JsonNode) => void;
  onNodeExpand: (node: JsonNode) => void;
  onNodeCollapse: (node: JsonNode) => void;
  onNodeEdit: (node: JsonNode, newValue: JsonValue) => void;
  onNodeAdd: (path: string, value: JsonValue) => void;
  onNodeDelete: (node: JsonNode) => void;
  onSearch: (query: string, results: SearchResult[]) => void;
  onValidationError: (errors: ValidationError[]) => void;
  onSave: (file: JsonFile) => Promise<void>;
  onLoad: (file: JsonFile) => void;
}

/**
 * Theme customization
 */
export interface TreeTheme {
  colors: {
    background: string;
    foreground: string;
    border: string;
    hover: string;
    selected: string;
    accent: string;
    error: string;
    warning: string;
    success: string;
  };
  fonts: {
    family: string;
    size: string;
    weight: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: string;
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

/**
 * Component props base interface
 */
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  testId?: string;
}

/**
 * Animation variants for Framer Motion
 */
export interface TreeAnimationVariants {
  container: Record<string, unknown>;
  node: Record<string, unknown>;
  expand: Record<string, unknown>;
  collapse: Record<string, unknown>;
  select: Record<string, unknown>;
  edit: Record<string, unknown>;
  search: Record<string, unknown>;
}

/**
 * Error boundary state
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Loading states
 */
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

/**
 * Selection state
 */
export interface SelectionState {
  selectedNodes: Set<string>;
  focusedNode: string | null;
  selectionRange?: {
    start: string;
    end: string;
  };
}

/**
 * Clipboard data
 */
export interface ClipboardData {
  type: 'node' | 'value' | 'path';
  data: JsonValue | string;
  sourcePath?: string;
  timestamp: Date;
}

/**
 * Drag and drop data
 */
export interface DragDropData {
  draggedNodes: JsonNode[];
  dropTarget: JsonNode | null;
  dropPosition: 'before' | 'after' | 'inside';
  isValid: boolean;
}

/**
 * Filter criteria
 */
export interface FilterCriteria {
  type?: JsonNodeType[];
  valuePattern?: RegExp;
  keyPattern?: RegExp;
  pathPattern?: RegExp;
  customFilter?: (node: JsonNode) => boolean;
}

/**
 * Sort criteria
 */
export interface SortCriteria {
  by: 'key' | 'value' | 'type' | 'size' | 'path';
  order: 'asc' | 'desc';
  customSort?: (a: JsonNode, b: JsonNode) => number;
}

/**
 * JsonTreeMenu main component props
 */
export interface JsonTreeMenuProps extends BaseComponentProps {
  // Data
  files?: JsonFile[];
  activeFile?: JsonFile;
  
  // Configuration
  config?: Partial<TreeConfig>;
  theme?: Partial<TreeTheme>;
  readOnly?: boolean;
  
  // Event handlers
  onFileSelect?: (file: JsonFile) => void;
  onFileSave?: (file: JsonFile, content: string) => Promise<void>;
  onNodeSelect?: (node: JsonNode) => void;
  onNodeEdit?: (node: JsonNode, value: JsonValue) => void;
  onValidationError?: (errors: ValidationError[]) => void;
  
  // UI state
  viewMode?: TreeViewMode;
  editMode?: EditMode;
  showSearch?: boolean;
  showBreadcrumb?: boolean;
  showValidation?: boolean;
  
  // Advanced features
  enableDragDrop?: boolean;
  enableMultiSelect?: boolean;
  enableVirtualScrolling?: boolean;
  
  // Ref
  ref?: React.RefObject<JsonTreeMenuRef>;
}

/**
 * JsonTreeNode component props
 */
export interface JsonTreeNodeProps extends BaseComponentProps {
  node: JsonNode;
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
  isEditing: boolean;
  isDragging?: boolean;
  isDropTarget?: boolean;
  dropPosition?: 'before' | 'after' | 'inside';
  
  // Event handlers
  onToggle: (path: string) => void;
  onSelect: (path: string) => void;
  onEdit: (path: string, value: JsonValue) => void;
  onDelete: (path: string) => void;
  onContextMenu: (event: MouseEvent, node: JsonNode) => void;
  onDragStart?: (event: DragEvent, node: JsonNode) => void;
  onDragEnd?: (event: DragEvent, node: JsonNode) => void;
  onDrop?: (event: DragEvent, target: JsonNode, position: string) => void;
  
  // Configuration
  showTypes?: boolean;
  showSizes?: boolean;
  showLineNumbers?: boolean;
  animationDuration?: number;
}

/**
 * JsonTreeSearch component props
 */
export interface JsonTreeSearchProps extends BaseComponentProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClear?: () => void;
  results: SearchResult[];
  onResultSelect: (path: string) => void;
  
  // Configuration
  placeholder?: string;
  debounceMs?: number;
  showResultCount?: boolean;
  enableRegex?: boolean;
  enableCaseSensitive?: boolean;
  
  // UI
  maxResults?: number;
  highlightMatches?: boolean;
  showPath?: boolean;
}

/**
 * JsonTreeBreadcrumb component props
 */
export interface JsonTreeBreadcrumbProps extends BaseComponentProps {
  path: string;
  onPathClick: (segment: PathSegment & { fullPath: string }) => void;
  onHomeClick?: () => void;
  
  // Configuration
  showHome?: boolean;
  maxSegments?: number;
  truncateFrom?: 'start' | 'middle' | 'end';
  
  // UI
  showFullPath?: boolean;
  enableCopy?: boolean;
  copyIcon?: string;
}

/**
 * JsonTreeValidation component props
 */
export interface JsonTreeValidationProps extends BaseComponentProps {
  validation: ValidationResult;
  onFixError?: (error: ValidationError) => void;
  onDismiss?: () => void;
  
  // Configuration
  showFixes?: boolean;
  showWarnings?: boolean;
  maxErrors?: number;
}

/**
 * JsonTreeContextMenu component props
 */
export interface JsonTreeContextMenuProps extends BaseComponentProps {
  actions?: ContextMenuAction[];
  onAction?: (actionId: string, node: JsonNode) => void;
}

/**
 * JsonTreeExport component props
 */
export interface JsonTreeExportProps extends BaseComponentProps {
  onExport: (options: ExportOptions) => Promise<string>;
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * useJsonTree hook return type
 */
export interface UseJsonTreeReturn {
  // State
  files: JsonFile[];
  activeFile: JsonFile | null;
  rootNode: JsonNode | null;
  expandedNodes: Set<string>;
  selectedNodes: Set<string>;
  searchQuery: string;
  searchResults: SearchResult[];
  viewMode: TreeViewMode;
  editMode: EditMode;
  isLoading: boolean;
  error: Error | null;
  validation: ValidationResult;
  
  // Actions
  loadFile: (file: JsonFile) => Promise<void>;
  saveFile: (file: JsonFile) => Promise<void>;
  selectFile: (file: JsonFile) => void;
  toggleNode: (path: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  selectNode: (path: string, multi?: boolean) => void;
  editNode: (path: string, value: JsonValue) => void;
  addNode: (path: string, key: string, value: JsonValue) => void;
  deleteNode: (path: string) => void;
  search: (query: string) => void;
  clearSearch: () => void;
  setViewMode: (mode: TreeViewMode) => void;
  setEditMode: (mode: EditMode) => void;
  validate: () => ValidationResult;
  export: (options: ExportOptions) => Promise<string>;
  import: (data: string, options: ImportOptions) => Promise<void>;
  
  // Utilities
  getNodeByPath: (path: string) => JsonNode | null;
  getPathSegments: (path: string) => PathSegment[];
  copyToClipboard: (path: string, type: 'node' | 'value' | 'path') => void;
  focus: () => void;
  expandToPath: (path: string) => void;
}

/**
 * useJsonSearch hook return type
 */
export interface UseJsonSearchReturn {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  searchTime: number;
  
  // Actions
  search: (query: string) => void;
  clearSearch: () => void;
  nextResult: () => void;
  previousResult: () => void;
  selectResult: (index: number) => void;
  
  // Configuration
  setOptions: (options: SearchOptions) => void;
}

/**
 * Search options
 */
export interface SearchOptions {
  caseSensitive: boolean;
  regex: boolean;
  includeKeys: boolean;
  includeValues: boolean;
  maxResults: number;
  fuzzySearch: boolean;
}

/**
 * useJsonValidation hook return type
 */
export interface UseJsonValidationReturn {
  validation: ValidationResult;
  isValidating: boolean;
  
  // Actions
  validate: () => ValidationResult;
  fixError: (error: ValidationError) => void;
  dismissError: (error: ValidationError) => void;
  dismissWarning: (warning: ValidationWarning) => void;
  clearErrors: () => void;
  clearWarnings: () => void;
}

/**
 * useJsonKeyboard hook return type
 */
export interface UseJsonKeyboardReturn {
  // Actions
  registerHandler: (key: string, handler: KeyboardHandler) => void;
  unregisterHandler: (key: string) => void;
  navigateToNext: () => void;
  navigateToPrevious: () => void;
  navigateToParent: () => void;
  navigateToFirstChild: () => void;
}

/**
 * useJsonPerformance hook return type
 */
export interface UseJsonPerformanceReturn {
  metrics: PerformanceMetrics;
  
  // Actions
  startRenderMeasure: () => void;
  endRenderMeasure: () => void;
  measureSearchTime: (searchFn: () => void) => number;
  observeNode: (element: HTMLElement, path: string) => void;
  unobserveNode: (element: HTMLElement) => void;
  getOptimizationSuggestions: () => string[];
}
