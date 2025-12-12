// Main store export
export { useJsonTreeStore } from './useJsonTreeStore';

// Types and interfaces
export type { JsonTreeState, JsonTreeActions, JsonTreeStore } from './types';

// Constants
export { initialJsonTreeState } from './constants';

// Selectors for optimized re-renders
export {
  useJsonTreeFiles,
  useJsonTreeActiveFile,
  useJsonTreeRootNode,
  useJsonTreeExpandedNodes,
  useJsonTreeSelectedNodes,
  useJsonTreeSearchResults,
  useJsonTreeValidation,
  useJsonTreeConfig,
  useJsonTreeIsLoading,
  useJsonTreeError,
  useJsonTreeViewMode,
  useJsonTreeEditMode,
  useJsonTreeSearchQuery,
  useJsonTreeIsSearching,
  useJsonTreeShowValidation,
  useJsonTreeFocusedNode,
  useJsonTreeIsEditing,
  useJsonTreeEditingPath,
  useJsonTreePendingChanges,
} from './useJsonTreeStore';