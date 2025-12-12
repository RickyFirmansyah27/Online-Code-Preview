import { JsonNode } from '../../components/tree/types/json.types';
import { JsonTreeState } from '../types';

/**
 * Tree operations actions
 */
export const createTreeActions = (set: (state: Partial<JsonTreeState>) => void, get: () => JsonTreeState) => ({
  /**
   * Set root node
   */
  setRootNode: (node: JsonNode | null) => set({ rootNode: node }),

  /**
   * Toggle node expansion
   */
  toggleNode: (path: string) => {
    const { expandedNodes } = get();
    const newExpanded = new Set(expandedNodes);
    
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    
    set({ expandedNodes: newExpanded });
  },

  /**
   * Expand all nodes
   */
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

  /**
   * Collapse all nodes
   */
  collapseAll: () => {
    set({ expandedNodes: new Set() });
  },

  /**
   * Expand to specific path
   */
  expandToPath: (path: string) => {
    const segments = path.split('.');
    const pathsToExpand: string[] = [];
    
    for (let i = 0; i < segments.length; i++) {
      pathsToExpand.push(segments.slice(0, i + 1).join('.'));
    }
    
    const currentExpanded = get().expandedNodes;
    set({
      expandedNodes: new Set([...currentExpanded, ...pathsToExpand]),
    });
  },
});