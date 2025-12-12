import { 
  JsonFile, 
  JsonNode, 
  JsonValue, 
  ValidationResult, 
  TreeConfig,
  JsonEditOperation,
  SearchResult,
  TreeViewMode,
  EditMode,
  PathSegment,
  ExportOptions,
  ImportOptions,
} from '../components/tree/types/json.types';

/**
 * Main JSON Tree Store interface
 */
export interface JsonTreeState {
  // File management
  files: JsonFile[];
  activeFile: JsonFile | null;
  
  // Tree state
  rootNode: JsonNode | null;
  expandedNodes: Set<string>;
  selectedNodes: Set<string>;
  focusedNode: string | null;
  
  // Edit state
  isEditing: boolean;
  editMode: EditMode;
  editingPath: string | null;
  pendingChanges: Map<string, JsonEditOperation>;
  
  // Search state
  searchQuery: string;
  searchResults: SearchResult[];
  isSearching: boolean;
  
  // UI state
  viewMode: TreeViewMode;
  showValidation: boolean;
  isLoading: boolean;
  error: Error | null;
  validation: ValidationResult;
  
  // Configuration
  config: TreeConfig;
}

/**
 * Store actions interface
 */
export interface JsonTreeActions {
  // File management
  setFiles: (files: JsonFile[]) => void;
  setActiveFile: (file: JsonFile | null) => void;
  loadFile: (file: JsonFile) => Promise<void>;
  saveFile: (file: JsonFile) => Promise<void>;
  
  // Tree operations
  setRootNode: (node: JsonNode | null) => void;
  toggleNode: (path: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  expandToPath: (path: string) => void;
  
  // Selection operations
  selectNode: (path: string, multi?: boolean) => void;
  selectRange: (startPath: string, endPath: string) => void;
  clearSelection: () => void;
  setFocusedNode: (path: string | null) => void;
  
  // Edit operations
  startEdit: (path: string) => void;
  endEdit: (path: string, value: JsonValue) => void;
  cancelEdit: () => void;
  addNode: (path: string, key: string, value: JsonValue) => void;
  deleteNode: (path: string) => void;
  moveNode: (fromPath: string, toPath: string) => void;
  copyNode: (fromPath: string, toPath: string) => void;
  
  // Search operations
  setSearchQuery: (query: string) => void;
  performSearch: (query: string) => void;
  clearSearch: () => void;
  
  // UI operations
  setViewMode: (mode: TreeViewMode) => void;
  setEditMode: (mode: EditMode) => void;
  setShowValidation: (show: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setValidation: (validation: ValidationResult) => void;
  
  // Configuration
  setConfig: (config: Partial<TreeConfig>) => void;
  
  // Utilities
  getNodeByPath: (path: string) => JsonNode | null;
  getPathSegments: (path: string) => PathSegment[];
  validateJson: () => ValidationResult;
  exportJson: (options: ExportOptions) => string;
  importJson: (data: string, options: ImportOptions) => void;
  reset: () => void;
}

/**
 * Complete store interface combining state and actions
 */
export type JsonTreeStore = JsonTreeState & JsonTreeActions;