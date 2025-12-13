import { JsonNode, JsonNodeType, JsonValue } from './json.types';

/**
 * Node appearance configuration
 */
export interface NodeAppearance {
  icon: string;
  color: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
}

/**
 * Node editing state
 */
export interface NodeEditingState {
  isEditing: boolean;
  editValue: string;
  originalValue?: JsonValue;
  validationError?: string;
  isDirty: boolean;
}

/**
 * Node interaction state
 */
export interface NodeInteractionState {
  isSelected: boolean;
  isHovered: boolean;
  isFocused: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  dropPosition?: 'before' | 'after' | 'inside';
}

/**
 * Node render options
 */
export interface NodeRenderOptions {
  showTypes: boolean;
  showSizes: boolean;
  showLineNumbers: boolean;
  showIcons: boolean;
  showActions: boolean;
  animationDuration: number;
  indentSize: number;
}

/**
 * Node validation result
 */
export interface NodeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions?: string[];
}

/**
 * Node action types
 */
export type NodeActionType = 
  | 'toggle'
  | 'select'
  | 'edit'
  | 'delete'
  | 'copy'
  | 'paste'
  | 'drag-start'
  | 'drag-end'
  | 'drop'
  | 'context-menu';

/**
 * Node event payload
 */
export interface NodeEventPayload {
  node: JsonNode;
  action: NodeActionType;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Node drag state
 */
export interface NodeDragState {
  isDragging: boolean;
  draggedNodes: JsonNode[];
  dropTarget?: JsonNode;
  dropPosition?: 'before' | 'after' | 'inside';
  isValidDrop: boolean;
}

/**
 * Node focus state
 */
export interface NodeFocusState {
  focusedNodePath?: string;
  focusedNodeIndex?: number;
  selectionStart?: number;
  selectionEnd?: number;
}

/**
 * Node expansion state
 */
export interface NodeExpansionState {
  expandedNodes: Set<string>;
  collapsedNodes: Set<string>;
  autoExpand: boolean;
  maxDepth: number;
}

/**
 * Node filter criteria
 */
export interface NodeFilterCriteria {
  types?: JsonNodeType[];
  keyPattern?: RegExp;
  valuePattern?: RegExp;
  pathPattern?: RegExp;
  minDepth?: number;
  maxDepth?: number;
  hasChildren?: boolean;
  isEditable?: boolean;
  customFilter?: (node: JsonNode) => boolean;
}

/**
 * Node sort options
 */
export interface NodeSortOptions {
  by: 'key' | 'value' | 'type' | 'size' | 'path' | 'index';
  order: 'asc' | 'desc';
  caseSensitive?: boolean;
  customSort?: (a: JsonNode, b: JsonNode) => number;
}

/**
 * Node search result
 */
export interface NodeSearchResult {
  node: JsonNode;
  matches: NodeSearchMatch[];
  score: number;
  context?: string;
}

/**
 * Node search match
 */
export interface NodeSearchMatch {
  path: string;
  key: string;
  value: string;
  keyMatch?: boolean;
  valueMatch?: boolean;
  startIndex?: number;
  endIndex?: number;
  matchType: 'exact' | 'partial' | 'regex' | 'fuzzy';
}

/**
 * Node clipboard data
 */
export interface NodeClipboardData {
  type: 'node' | 'value' | 'path' | 'key';
  data: JsonValue | string;
  sourcePath: string;
  timestamp: Date;
  metadata?: {
    nodeType?: JsonNodeType;
    originalParent?: string;
    cutOperation?: boolean;
  };
}

/**
 * Node performance metrics
 */
export interface NodePerformanceMetrics {
  renderTime: number;
  nodeCount: number;
  visibleNodes: number;
  expandedNodes: number;
  memoryUsage: number;
  lastUpdate: Date;
}

/**
 * Node accessibility options
 */
export interface NodeAccessibilityOptions {
  announceChanges: boolean;
  keyboardNavigation: boolean;
  screenReaderSupport: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  focusVisible: boolean;
}

/**
 * Node theme customization
 */
export interface NodeTheme {
  colors: {
    background: string;
    selected: string;
    hover: string;
    focus: string;
    drag: string;
    drop: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: string;
    icon: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
  };
  borderRadius: string;
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
  };
  animation: {
    duration: {
      fast: number;
      normal: number;
      slow: number;
    };
    easing: string;
  };
}