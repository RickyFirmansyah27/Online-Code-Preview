import { JsonValue, TreeViewMode, EditMode, ValidationResult, JsonEditOperation } from '../../components/tree/types/json.types';
import { JsonTreeState } from '../types';

/**
 * UI and edit operations actions
 */
export const createUIActions = (set: (state: Partial<JsonTreeState>) => void, get: () => JsonTreeState) => ({
  /**
   * Set view mode
   */
  setViewMode: (mode: TreeViewMode) => {
    set({ viewMode: mode });
  },

  /**
   * Set edit mode
   */
  setEditMode: (mode: EditMode) => {
    set({ editMode: mode });
  },

  /**
   * Show/hide validation
   */
  setShowValidation: (show: boolean) => {
    set({ showValidation: show });
  },

  /**
   * Set loading state
   */
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  /**
   * Set error state
   */
  setError: (error: Error | null) => {
    set({ error });
  },

  /**
   * Set validation state
   */
  setValidation: (validation: ValidationResult) => {
    set({ validation });
  },

  /**
   * Set configuration
   */
  setConfig: (config: Partial<JsonTreeState['config']>) => {
    const currentConfig = get().config;
    set({
      config: { ...currentConfig, ...config },
    });
  },

  /**
   * Start editing node
   */
  startEdit: (path: string) => {
    set({
      isEditing: true,
      editingPath: path,
    });
  },

  /**
   * End editing and save changes
   */
  endEdit: (path: string, value: JsonValue) => {
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

  /**
   * Cancel editing
   */
  cancelEdit: () => {
    set({
      isEditing: false,
      editingPath: null,
    });
  },

  /**
   * Add new node (placeholder)
   */
  addNode: (_path: string, _key: string, _value: JsonValue) => {
    // Implement add node logic
    console.warn('addNode not implemented yet');
  },

  /**
   * Delete node (placeholder)
   */
  deleteNode: (_path: string) => {
    // Implement delete node logic
    console.warn('deleteNode not implemented yet');
  },

  /**
   * Move node (placeholder)
   */
  moveNode: (_fromPath: string, _toPath: string) => {
    // Implement move node logic
    console.warn('moveNode not implemented yet');
  },

  /**
   * Copy node (placeholder)
   */
  copyNode: (_fromPath: string, _toPath: string) => {
    // Implement copy node logic
    console.warn('copyNode not implemented yet');
  },
});