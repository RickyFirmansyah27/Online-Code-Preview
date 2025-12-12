import { JsonTreeState, JsonTreeActions } from './types';
import { JsonEditOperation } from '../components/tree/types/json.types';

/**
 * Initial state for the JSON Tree store
 */
export const initialJsonTreeState: Omit<JsonTreeState, keyof JsonTreeActions> = {
  // File management
  files: [],
  activeFile: null,
  
  // Tree state
  rootNode: null,
  expandedNodes: new Set<string>(),
  selectedNodes: new Set<string>(),
  focusedNode: null,
  
  // Edit state
  isEditing: false,
  editMode: 'inline',
  editingPath: null,
  pendingChanges: new Map<string, JsonEditOperation>(),
  
  // Search state
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  
  // UI state
  viewMode: 'tree',
  showValidation: true,
  isLoading: false,
  error: null,
  validation: {
    isValid: true,
    errors: [],
    warnings: [],
  },
  
  // Configuration
  config: {
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
  },
};