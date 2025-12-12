import { JsonTreeState } from '../types';

/**
 * Selection operations actions
 */
export const createSelectionActions = (set: (state: Partial<JsonTreeState>) => void, get: () => JsonTreeState) => ({
  /**
   * Select node (single or multi)
   */
  selectNode: (path: string, multi = false) => {
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

  /**
   * Select range of nodes (placeholder implementation)
   */
  selectRange: (_startPath: string, _endPath: string) => {
    // Implement range selection logic
    // This would require traversing the tree to find all nodes between paths
    console.warn('selectRange not implemented yet');
  },

  /**
   * Clear all selections
   */
  clearSelection: () => {
    set({ selectedNodes: new Set(), focusedNode: null });
  },

  /**
   * Set focused node
   */
  setFocusedNode: (path: string | null) => {
    set({ focusedNode: path });
  },
});