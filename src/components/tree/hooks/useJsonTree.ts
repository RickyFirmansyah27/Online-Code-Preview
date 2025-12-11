import { useCallback, useEffect, useRef } from 'react';
import { useJsonTreeStore } from '../../../store/useJsonTreeStore';
import {
  JsonFile,
  JsonNode,
  JsonValue,
  ValidationResult,
  ValidationError,
  ExportOptions,
  ImportOptions,
  UseJsonTreeReturn,
  TreeConfig,
  TreeViewMode,
  EditMode
} from '../types/json.types';

interface UseJsonTreeProps {
  files?: JsonFile[];
  activeFile?: JsonFile;
  config?: Partial<TreeConfig>;
  onFileSelect?: (file: JsonFile) => void;
  onFileSave?: (file: JsonFile, content: string) => Promise<void>;
  onNodeSelect?: (node: JsonNode) => void;
  onNodeEdit?: (node: JsonNode, value: JsonValue) => void;
  onValidationError?: (errors: ValidationError[]) => void;
}

export const useJsonTree = ({
  files = [],
  activeFile,
  config = {},
  onFileSelect,
  onFileSave,
  onNodeSelect,
  onNodeEdit,
  onValidationError,
}: UseJsonTreeProps): UseJsonTreeReturn => {
  const store = useJsonTreeStore();
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const prevFilesRef = useRef<JsonFile[]>();
  const prevConfigRef = useRef<Partial<TreeConfig>>();
  const prevActiveFileRef = useRef<JsonFile>();

  // Initialize files
  useEffect(() => {
    if (JSON.stringify(prevFilesRef.current) !== JSON.stringify(files)) {
      store.setFiles(files);
      prevFilesRef.current = files;
    }
  }, [files, store]);

  // Initialize config
  useEffect(() => {
    if (JSON.stringify(prevConfigRef.current) !== JSON.stringify(config)) {
      store.setConfig(config);
      prevConfigRef.current = config;
    }
  }, [config, store]);

  // Load active file
  useEffect(() => {
    if (activeFile && activeFile !== prevActiveFileRef.current) {
      store.loadFile(activeFile);
      prevActiveFileRef.current = activeFile;
    }
  }, [activeFile, store]);

  // File operations
  const loadFile = useCallback(async (file: JsonFile) => {
    await store.loadFile(file);
    onFileSelect?.(file);
  }, [store, onFileSelect]);

  const saveFile = useCallback(async (file: JsonFile) => {
    await store.saveFile(file);
    if (onFileSave) {
      const { rootNode } = store;
      if (rootNode) {
        const jsonContent = JSON.stringify(rootNode.value, null, 2);
        await onFileSave(file, jsonContent);
      }
    }
  }, [store, onFileSave]);

  const selectFile = useCallback((file: JsonFile) => {
    store.setActiveFile(file);
    onFileSelect?.(file);
  }, [store, onFileSelect]);

  // Tree operations
  const toggleNode = useCallback((path: string) => {
    store.toggleNode(path);
  }, [store]);

  const expandAll = useCallback(() => {
    store.expandAll();
  }, [store]);

  const collapseAll = useCallback(() => {
    store.collapseAll();
  }, [store]);

  const selectNode = useCallback((path: string, multi = false) => {
    store.selectNode(path, multi);
    const node = store.getNodeByPath(path);
    if (node) {
      onNodeSelect?.(node);
    }
  }, [store, onNodeSelect]);

  const editNode = useCallback((path: string, value: JsonValue) => {
    store.endEdit(path, value);
    const node = store.getNodeByPath(path);
    if (node) {
      onNodeEdit?.(node, value);
    }
  }, [store, onNodeEdit]);

  const addNode = useCallback((path: string, key: string, value: JsonValue) => {
    store.addNode(path, key, value);
  }, [store]);

  const deleteNode = useCallback((path: string) => {
    store.deleteNode(path);
  }, [store]);

  // Search operations
  const search = useCallback((query: string) => {
    store.setSearchQuery(query); // Update query immediately for UI

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      store.performSearch(query);
    }, store.config.searchDebounceMs);
  }, [store]);

  const clearSearch = useCallback(() => {
    store.clearSearch();
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, [store]);

  // View operations
  const setViewMode = useCallback((mode: TreeViewMode) => {
    store.setViewMode(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setEditMode = useCallback((mode: EditMode) => {
    store.setEditMode(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validation
  const validate = useCallback((): ValidationResult => {
    const validation = store.validateJson();
    if (!validation.isValid && validation.errors.length > 0) {
      onValidationError?.(validation.errors);
    }
    return validation;
  }, [onValidationError, store]);

  // Export/Import
  const exportJson = useCallback(async (options: ExportOptions): Promise<string> => {
    return store.exportJson(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const importJson = useCallback(async (data: string, options: ImportOptions) => {
    store.importJson(data, options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Utilities
  const getNodeByPath = useCallback((path: string): JsonNode | null => {
    return store.getNodeByPath(path);
  }, [store]);

  const copyToClipboard = useCallback(async (path: string, type: 'node' | 'value' | 'path') => {
    const node = store.getNodeByPath(path);
    if (!node) return;

    let textToCopy = '';
    switch (type) {
      case 'path':
        textToCopy = path;
        break;
      case 'value':
        textToCopy = JSON.stringify(node.value);
        break;
      case 'node':
        textToCopy = JSON.stringify({ [node.key]: node.value });
        break;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, [store]);

  const focus = useCallback(() => {
    // Focus the tree container
    const treeElement = document.querySelector('[data-testid="json-tree-menu"]');
    if (treeElement) {
      (treeElement as HTMLElement).focus();
    }
  }, []);

  const getPathSegments = useCallback((path: string) => {
    return store.getPathSegments(path);
  }, [store]);

  return {
    // State
    files: store.files,
    activeFile: store.activeFile,
    rootNode: store.rootNode,
    expandedNodes: store.expandedNodes,
    selectedNodes: store.selectedNodes,
    searchQuery: store.searchQuery,
    searchResults: store.searchResults,
    viewMode: store.viewMode,
    editMode: store.editMode,
    isLoading: store.isLoading,
    error: store.error,
    validation: store.validation,

    // Actions
    loadFile,
    saveFile,
    selectFile,
    toggleNode,
    expandAll,
    collapseAll,
    selectNode,
    editNode,
    addNode,
    deleteNode,
    search,
    clearSearch,
    setViewMode,
    setEditMode,
    validate,
    export: exportJson,
    import: importJson,
    getNodeByPath,
    getPathSegments,
    copyToClipboard,
    focus,
  };
};