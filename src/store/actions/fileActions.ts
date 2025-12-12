import { JsonFile, JsonNode, JsonValue } from '../../components/tree/types/json.types';
import { JsonTreeState } from '../types';

/**
 * Build tree structure from JSON data
 */
const buildTree = (obj: JsonValue, path: string, level: number, config: JsonTreeState['config']): JsonNode[] => {
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
        isExpanded: config.defaultExpanded,
        children: Array.isArray(item) || (typeof item === 'object' && item !== null)
          ? buildTree(item, nodePath, level + 1, config)
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
        isExpanded: config.defaultExpanded,
        children: Array.isArray(value) || (typeof value === 'object' && value !== null)
          ? buildTree(value, nodePath, level + 1, config)
          : undefined,
      };
      nodes.push(node);
    });
  }
  
  return nodes;
};

/**
 * Convert tree structure back to JSON
 */
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

/**
 * File management actions
 */
export const createFileActions = (set: (state: Partial<JsonTreeState>) => void, get: () => JsonTreeState) => ({
  /**
   * Set files list
   */
  setFiles: (files: JsonFile[]) => set({ files }),

  /**
   * Set active file
   */
  setActiveFile: (file: JsonFile | null) => set({ activeFile: file }),

  /**
   * Load file and parse JSON content
   */
  loadFile: async (file: JsonFile) => {
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
      rootNode.children = buildTree(parsedData, '', 1, get().config);
      
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

  /**
   * Save file and convert tree back to JSON
   */
  saveFile: async (file: JsonFile) => {
    try {
      set({ isLoading: true, error: null });
      
      const { rootNode } = get();
      if (!rootNode) {
        throw new Error('No root node to save');
      }
      
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
});