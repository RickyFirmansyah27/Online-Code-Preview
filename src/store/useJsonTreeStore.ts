import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { JsonTreeStore } from './types';
import { initialJsonTreeState } from './constants';
import {
  createFileActions,
  createTreeActions,
  createSelectionActions,
  createSearchActions,
  createUIActions,
  createUtilActions,
} from './actions';

/**
 * Main JSON Tree Store using Zustand
 * 
 * This store manages the state of the JSON tree editor including:
 * - File management (loading, saving, parsing)
 * - Tree operations (expand, collapse, navigation)
 * - Selection and editing
 * - Search functionality
 * - UI state management
 * - Export/Import utilities
 */
export const useJsonTreeStore = create<JsonTreeStore>()(
  subscribeWithSelector((set, get) => {
    // Get current state helper
    const currentState = () => get() as JsonTreeStore;

    // Combine all action creators
    const fileActions = createFileActions(set, currentState);
    const treeActions = createTreeActions(set, currentState);
    const selectionActions = createSelectionActions(set, currentState);
    const searchActions = createSearchActions(set, currentState);
    const uiActions = createUIActions(set, currentState);
    const utilActions = createUtilActions(set, currentState);

    // Return combined state and actions
    return {
      // Initial state
      ...initialJsonTreeState,

      // File management actions
      ...fileActions,

      // Tree operations actions
      ...treeActions,

      // Selection operations actions
      ...selectionActions,

      // Search operations actions
      ...searchActions,

      // UI and edit operations actions
      ...uiActions,

      // Utility actions
      ...utilActions,
    };
  })
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
export const useJsonTreeIsLoading = () => useJsonTreeStore((state) => state.isLoading);
export const useJsonTreeError = () => useJsonTreeStore((state) => state.error);
export const useJsonTreeViewMode = () => useJsonTreeStore((state) => state.viewMode);
export const useJsonTreeEditMode = () => useJsonTreeStore((state) => state.editMode);
export const useJsonTreeSearchQuery = () => useJsonTreeStore((state) => state.searchQuery);
export const useJsonTreeIsSearching = () => useJsonTreeStore((state) => state.isSearching);
export const useJsonTreeShowValidation = () => useJsonTreeStore((state) => state.showValidation);
export const useJsonTreeFocusedNode = () => useJsonTreeStore((state) => state.focusedNode);
export const useJsonTreeIsEditing = () => useJsonTreeStore((state) => state.isEditing);
export const useJsonTreeEditingPath = () => useJsonTreeStore((state) => state.editingPath);
export const useJsonTreePendingChanges = () => useJsonTreeStore((state) => state.pendingChanges);