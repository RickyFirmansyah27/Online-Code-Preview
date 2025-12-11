import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
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
import { exportJson, importData } from '../components/tree/utils/exportUtils';

interface JsonTreeState {
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
  
  // Actions
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

const initialState: Omit<JsonTreeState, 'setFiles' | 'setActiveFile' | 'loadFile' | 'saveFile' | 'setRootNode' | 'toggleNode' | 'expandAll' | 'collapseAll' | 'expandToPath' | 'selectNode' | 'selectRange' | 'clearSelection' | 'setFocusedNode' | 'startEdit' | 'endEdit' | 'cancelEdit' | 'addNode' | 'deleteNode' | 'moveNode' | 'copyNode' | 'setSearchQuery' | 'performSearch' | 'clearSearch' | 'setViewMode' | 'setEditMode' | 'setShowValidation' | 'setLoading' | 'setError' | 'setValidation' | 'setConfig' | 'getNodeByPath' | 'getPathSegments' | 'validateJson' | 'exportJson' | 'importJson' | 'reset'> = {
  files: [],
  activeFile: null,
  rootNode: null,
  expandedNodes: new Set<string>(),
  selectedNodes: new Set<string>(),
  focusedNode: null,
  isEditing: false,
  editMode: 'inline',
  editingPath: null,
  pendingChanges: new Map<string, JsonEditOperation>(),
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  viewMode: 'tree',
  showValidation: true,
  isLoading: false,
  error: null,
  validation: {
    isValid: true,
    errors: [],
    warnings: [],
  },
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

export const useJsonTreeStore = create<JsonTreeState>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,
    
    // File management
    setFiles: (files) => set({ files }),
    
    setActiveFile: (file) => set({ activeFile: file }),
    
    loadFile: async (file) => {
      try {
        set({ isLoading: true, error: null });
        
        // Parse JSON content
        const parsedData = JSON.parse(file.content);
        
        // Create root node
        const rootNode: JsonNode = {
          key: 'root',
          value: parsedData,
          path: '',
          level: 0,
          type: Array.isArray(parsedData) ? 'array' : 'object',
          isExpanded: get().config.defaultExpanded,
          children: [],
        };
        
        // Build tree structure
        const buildTree = (obj: JsonValue, path: string, level: number): JsonNode[] => {
          const nodes: JsonNode[] = [];
          
          if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
              const nodePath = `${path}[${index}]`;
              const node: JsonNode = {
                key: index.toString(),
                value: item,
                path: nodePath,
                level,
                type: Array.isArray(item) ? 'array' :
                      typeof item === 'object' && item !== null ? 'object' :
                      typeof item === 'string' ? 'string' :
                      typeof item === 'number' ? 'number' :
                      typeof item === 'boolean' ? 'boolean' :
                      'null',
                isExpanded: get().config.defaultExpanded,
                children: Array.isArray(item) || (typeof item === 'object' && item !== null)
                  ? buildTree(item, nodePath, level + 1)
                  : undefined,
              };
              nodes.push(node);
            });
          } else if (typeof obj === 'object' && obj !== null) {
            Object.entries(obj).forEach(([key, value]) => {
              const nodePath = path ? `${path}.${key}` : key;
              const node: JsonNode = {
                key,
                value: value as JsonValue,
                path: nodePath,
                level,
                type: Array.isArray(value) ? 'array' :
                      typeof value === 'object' && value !== null ? 'object' :
                      typeof value === 'string' ? 'string' :
                      typeof value === 'number' ? 'number' :
                      typeof value === 'boolean' ? 'boolean' :
                      'null',
                isExpanded: get().config.defaultExpanded,
                children: Array.isArray(value) || (typeof value === 'object' && value !== null)
                  ? buildTree(value, nodePath, level + 1)
                  : undefined,
              };
              nodes.push(node);
            });
          }
          
          return nodes;
        };
        
        rootNode.children = buildTree(parsedData, '', 1);
        
        set({
          activeFile: file,
          rootNode,
          isLoading: false,
          error: null,
        });
        
      } catch (error) {
        set({
          error: error as Error,
          isLoading: false,
        });
      }
    },
    
    saveFile: async (file) => {
      try {
        set({ isLoading: true, error: null });
        
        const { rootNode } = get();
        if (!rootNode) {
          throw new Error('No root node to save');
        }
        
        // Convert tree back to JSON
        const treeToJson = (node: JsonNode): JsonValue => {
          if (node.type === 'array') {
            return node.children?.map(child => treeToJson(child)) || [];
          } else if (node.type === 'object') {
            const obj: Record<string, JsonValue> = {};
            node.children?.forEach(child => {
              obj[child.key] = treeToJson(child);
            });
            return obj;
          } else {
            return node.value;
          }
        };
        
        const jsonContent = JSON.stringify(treeToJson(rootNode), null, 2);
        
        // Update file content
        const updatedFile = {
          ...file,
          content: jsonContent,
          isDirty: false,
          lastModified: new Date(),
        };
        
        set({
          activeFile: updatedFile,
          isLoading: false,
        });
        
      } catch (error) {
        set({
          error: error as Error,
          isLoading: false,
        });
      }
    },
    
    // Tree operations
    setRootNode: (node) => set({ rootNode: node }),
    
    toggleNode: (path) => {
      const { expandedNodes } = get();
      const newExpanded = new Set(expandedNodes);
      
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      
      set({ expandedNodes: newExpanded });
    },
    
    expandAll: () => {
      const { rootNode } = get();
      if (!rootNode) return;
      
      const getAllPaths = (node: JsonNode): string[] => {
        const paths = [node.path];
        if (node.children) {
          node.children.forEach(child => {
            paths.push(...getAllPaths(child));
          });
        }
        return paths;
      };
      
      const allPaths = getAllPaths(rootNode);
      set({ expandedNodes: new Set(allPaths) });
    },
    
    collapseAll: () => {
      set({ expandedNodes: new Set() });
    },
    
    expandToPath: (path) => {
      const segments = path.split('.');
      const pathsToExpand: string[] = [];
      
      for (let i = 0; i < segments.length; i++) {
        pathsToExpand.push(segments.slice(0, i + 1).join('.'));
      }
      
      set((state) => ({
        expandedNodes: new Set([...state.expandedNodes, ...pathsToExpand]),
      }));
    },
    
    // Selection operations
    selectNode: (path, multi = false) => {
      const { selectedNodes, config } = get();
      
      if (multi && config.enableMultiSelect) {
        const newSelected = new Set(selectedNodes);
        if (newSelected.has(path)) {
          newSelected.delete(path);
        } else {
          newSelected.add(path);
        }
        set({ selectedNodes: newSelected });
      } else {
        set({ selectedNodes: new Set([path]) });
      }
    },
    
    selectRange: (_startPath, _endPath) => {
      // Implement range selection logic
      // This would require traversing the tree to find all nodes between paths
    },
    
    clearSelection: () => {
      set({ selectedNodes: new Set(), focusedNode: null });
    },
    
    setFocusedNode: (path) => {
      set({ focusedNode: path });
    },
    
    // Edit operations
    startEdit: (path) => {
      set({
        isEditing: true,
        editingPath: path,
      });
    },
    
    endEdit: (path, value) => {
      const { pendingChanges } = get();
      const operation: JsonEditOperation = {
        type: 'update',
        path,
        newValue: value,
        timestamp: new Date(),
      };
      
      pendingChanges.set(path, operation);
      
      set({
        isEditing: false,
        editingPath: null,
        pendingChanges: new Map(pendingChanges),
      });
    },
    
    cancelEdit: () => {
      set({
        isEditing: false,
        editingPath: null,
      });
    },
    
    addNode: (_path, _key, _value) => {
      // Implement add node logic
    },
    
    deleteNode: (_path) => {
      // Implement delete node logic
    },
    
    moveNode: (_fromPath, _toPath) => {
      // Implement move node logic
    },
    
    copyNode: (_fromPath, _toPath) => {
      // Implement copy node logic
    },
    
    // Search operations
    setSearchQuery: (query) => {
      set({ searchQuery: query });
    },
    
    performSearch: (query) => {
      const { rootNode } = get();

      if (!rootNode || !query.trim()) {
        set({ searchResults: [], isSearching: false });
        return;
      }

      set({ isSearching: true });

      // Import search utilities
      import('../components/tree/utils/searchUtils').then(({ searchTree, DEFAULT_SEARCH_OPTIONS }) => {
        const results = searchTree(rootNode, query, {
          ...DEFAULT_SEARCH_OPTIONS,
          maxResults: 100,
        });

        set({
          searchResults: results,
          isSearching: false,
        });
      }).catch(error => {
        console.error('Failed to perform search:', error);
        set({ isSearching: false });
      });
    },
    
    clearSearch: () => {
      set({
        searchQuery: '',
        searchResults: [],
        isSearching: false,
      });
    },
    
    // UI operations
    setViewMode: (mode) => {
      set({ viewMode: mode });
    },
    
    setEditMode: (mode) => {
      set({ editMode: mode });
    },
    
    setShowValidation: (show) => {
      set({ showValidation: show });
    },
    
    setLoading: (loading) => {
      set({ isLoading: loading });
    },
    
    setError: (error) => {
      set({ error });
    },
    
    setValidation: (validation) => {
      set({ validation });
    },
    
    // Configuration
    setConfig: (config) => {
      set((state) => ({
        config: { ...state.config, ...config },
      }));
    },
    
    // Utilities
    getNodeByPath: (path) => {
      const { rootNode } = get();
      if (!rootNode) return null;
      
      const findNode = (node: JsonNode, targetPath: string): JsonNode | null => {
        if (node.path === targetPath) return node;
        
        if (node.children) {
          for (const child of node.children) {
            const found = findNode(child, targetPath);
            if (found) return found;
          }
        }
        
        return null;
      };
      
      return findNode(rootNode, path);
    },
    
    getPathSegments: (path) => {
      if (!path) return [];
      const segments: PathSegment[] = [];
      const parts = path.split('.');
      
      parts.forEach((part) => {
        const arrayMatch = part.match(/^([^\[]+)\[(\d+)\]$/);
        if (arrayMatch) {
          segments.push({ key: arrayMatch[1], type: 'property' });
          segments.push({ key: arrayMatch[2], type: 'index', index: parseInt(arrayMatch[2]) });
        } else {
          segments.push({ key: part, type: 'property' });
        }
      });
      
      return segments;
    },
    
    validateJson: () => {
      const { rootNode } = get();
      
      if (!rootNode) {
        return {
          isValid: false,
          errors: [{ path: '', message: 'No JSON data to validate', code: 'NO_DATA', severity: 'error' as const }],
          warnings: [],
        };
      }
      
      // Implement validation logic
      return {
        isValid: true,
        errors: [],
        warnings: [],
      };
    },
    
    exportJson: (options) => {
      const { rootNode } = get();
      if (!rootNode) return '';
      
      return exportJson(rootNode.value, options);
    },
    
    importJson: (data, options) => {
      const _parsedData = importData(data, options);
      // Implement logic to update the store's state with the imported data
    },
    
    reset: () => {
      set(initialState as JsonTreeState);
    },
  }))
);

// Selectors for optimized re-renders
export const useJsonTreeFiles = () => useJsonTreeStore((state) => state.files);
export const useJsonTreeActiveFile = () => useJsonTreeStore((state) => state.activeFile);
export const useJsonTreeRootNode = () => useJsonTreeStore((state) => state.rootNode);
export const useJsonTreeExpandedNodes = () => useJsonTreeStore((state) => state.expandedNodes);
export const useJsonTreeSelectedNodes = () => useJsonTreeStore((state) => state.selectedNodes);
export const useJsonTreeSearchResults = () => useJsonTreeStore((state) => state.searchResults);
export const useJsonTreeValidation = () => useJsonTreeStore((state) => state.validation);
export const useJsonTreeConfig = () => useJsonTreeStore((state) => state.config);