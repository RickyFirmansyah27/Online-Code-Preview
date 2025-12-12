/**
 * Keyboard shortcuts configuration for JSON Tree Menu
 */

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  description: string;
  action: string;
  category: 'navigation' | 'editing' | 'selection' | 'search' | 'file' | 'view';
}

export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  // Navigation
  {
    key: 'ArrowUp',
    description: 'Navigate to previous node',
    action: 'navigateUp',
    category: 'navigation',
  },
  {
    key: 'ArrowDown',
    description: 'Navigate to next node',
    action: 'navigateDown',
    category: 'navigation',
  },
  {
    key: 'ArrowLeft',
    description: 'Collapse current node or navigate to parent',
    action: 'navigateLeft',
    category: 'navigation',
  },
  {
    key: 'ArrowRight',
    description: 'Expand current node or navigate to first child',
    action: 'navigateRight',
    category: 'navigation',
  },
  {
    key: 'Home',
    description: 'Navigate to first node',
    action: 'navigateToFirst',
    category: 'navigation',
  },
  {
    key: 'End',
    description: 'Navigate to last node',
    action: 'navigateToLast',
    category: 'navigation',
  },
  {
    key: 'PageUp',
    description: 'Navigate up one page',
    action: 'navigatePageUp',
    category: 'navigation',
  },
  {
    key: 'PageDown',
    description: 'Navigate down one page',
    action: 'navigatePageDown',
    category: 'navigation',
  },

  // Node Operations
  {
    key: ' ',
    description: 'Toggle expand/collapse current node',
    action: 'toggleNode',
    category: 'navigation',
  },
  {
    key: 'Enter',
    description: 'Expand current node or start editing',
    action: 'activateNode',
    category: 'editing',
  },
  {
    key: 'F2',
    description: 'Start editing current node',
    action: 'startEdit',
    category: 'editing',
  },
  {
    key: 'Delete',
    description: 'Delete current node',
    action: 'deleteNode',
    category: 'editing',
  },
  {
    key: 'Insert',
    description: 'Add new node',
    action: 'addNode',
    category: 'editing',
  },

  // Selection
  {
    key: 'a',
    ctrlKey: true,
    description: 'Select all nodes',
    action: 'selectAll',
    category: 'selection',
  },
  {
    key: 'a',
    ctrlKey: true,
    shiftKey: true,
    description: 'Deselect all nodes',
    action: 'deselectAll',
    category: 'selection',
  },
  {
    key: 'Click',
    description: 'Select single node',
    action: 'selectNode',
    category: 'selection',
  },
  {
    key: 'Click',
    ctrlKey: true,
    description: 'Toggle node selection (multi-select)',
    action: 'toggleSelection',
    category: 'selection',
  },
  {
    key: 'Click',
    shiftKey: true,
    description: 'Select range of nodes',
    action: 'selectRange',
    category: 'selection',
  },

  // Search
  {
    key: 'f',
    ctrlKey: true,
    description: 'Focus search input',
    action: 'focusSearch',
    category: 'search',
  },
  {
    key: '/',
    ctrlKey: true,
    description: 'Alternative search shortcut',
    action: 'focusSearch',
    category: 'search',
  },
  {
    key: 'F3',
    description: 'Find next search result',
    action: 'findNext',
    category: 'search',
  },
  {
    key: 'F3',
    shiftKey: true,
    description: 'Find previous search result',
    action: 'findPrevious',
    category: 'search',
  },
  {
    key: 'Escape',
    description: 'Clear search or exit edit mode',
    action: 'escape',
    category: 'search',
  },

  // File Operations
  {
    key: 's',
    ctrlKey: true,
    description: 'Save current file',
    action: 'saveFile',
    category: 'file',
  },
  {
    key: 'o',
    ctrlKey: true,
    description: 'Open file',
    action: 'openFile',
    category: 'file',
  },
  {
    key: 'n',
    ctrlKey: true,
    description: 'New file',
    action: 'newFile',
    category: 'file',
  },
  {
    key: 'e',
    ctrlKey: true,
    description: 'Export file',
    action: 'exportFile',
    category: 'file',
  },
  {
    key: 'i',
    ctrlKey: true,
    description: 'Import file',
    action: 'importFile',
    category: 'file',
  },

  // Edit Operations
  {
    key: 'z',
    ctrlKey: true,
    description: 'Undo last action',
    action: 'undo',
    category: 'editing',
  },
  {
    key: 'y',
    ctrlKey: true,
    description: 'Redo last action',
    action: 'redo',
    category: 'editing',
  },
  {
    key: 'x',
    ctrlKey: true,
    description: 'Cut selected nodes',
    action: 'cut',
    category: 'editing',
  },
  {
    key: 'c',
    ctrlKey: true,
    description: 'Copy selected nodes',
    action: 'copy',
    category: 'editing',
  },
  {
    key: 'v',
    ctrlKey: true,
    description: 'Paste nodes',
    action: 'paste',
    category: 'editing',
  },
  {
    key: 'd',
    ctrlKey: true,
    description: 'Duplicate selected nodes',
    action: 'duplicate',
    category: 'editing',
  },

  // View Operations
  {
    key: 'e',
    ctrlKey: true,
    shiftKey: true,
    description: 'Expand all nodes',
    action: 'expandAll',
    category: 'view',
  },
  {
    key: 'w',
    ctrlKey: true,
    shiftKey: true,
    description: 'Collapse all nodes',
    action: 'collapseAll',
    category: 'view',
  },
  {
    key: '1',
    ctrlKey: true,
    description: 'Switch to tree view',
    action: 'treeView',
    category: 'view',
  },
  {
    key: '2',
    ctrlKey: true,
    description: 'Switch to raw view',
    action: 'rawView',
    category: 'view',
  },
  {
    key: 't',
    ctrlKey: true,
    description: 'Toggle line numbers',
    action: 'toggleLineNumbers',
    category: 'view',
  },
  {
    key: 'y',
    ctrlKey: true,
    shiftKey: true,
    description: 'Toggle type indicators',
    action: 'toggleTypes',
    category: 'view',
  },
  {
    key: 's',
    ctrlKey: true,
    shiftKey: true,
    description: 'Toggle size indicators',
    action: 'toggleSizes',
    category: 'view',
  },

  // Context Menu
  {
    key: 'ContextMenu',
    description: 'Open context menu',
    action: 'contextMenu',
    category: 'editing',
  },
  {
    key: 'F10',
    shiftKey: true,
    description: 'Alternative context menu',
    action: 'contextMenu',
    category: 'editing',
  },

  // Validation
  {
    key: 'v',
    ctrlKey: true,
    shiftKey: true,
    description: 'Validate JSON',
    action: 'validate',
    category: 'file',
  },

  // Help
  {
    key: 'F1',
    description: 'Show help',
    action: 'showHelp',
    category: 'view',
  },
  {
    key: '?',
    shiftKey: true,
    description: 'Show keyboard shortcuts',
    action: 'showShortcuts',
    category: 'view',
  },
];

export const KEYBOARD_SHORTCUT_CATEGORIES = {
  navigation: 'Navigation',
  editing: 'Editing',
  selection: 'Selection',
  search: 'Search',
  file: 'File Operations',
  view: 'View Options',
} as const;

export const getShortcutKey = (shortcut: KeyboardShortcut): string => {
  const parts: string[] = [];
  
  if (shortcut.ctrlKey) parts.push('Ctrl');
  if (shortcut.altKey) parts.push('Alt');
  if (shortcut.shiftKey) parts.push('Shift');
  if (shortcut.metaKey) parts.push('Meta');
  
  let key = shortcut.key;
  
  // Special key mappings
  const keyMap: Record<string, string> = {
    ' ': 'Space',
    'ArrowUp': '↑',
    'ArrowDown': '↓',
    'ArrowLeft': '←',
    'ArrowRight': '→',
    'ContextMenu': 'Menu',
  };
  
  if (keyMap[key]) {
    key = keyMap[key];
  }
  
  parts.push(key);
  
  return parts.join(' + ');
};

export const getShortcutsByCategory = (category: KeyboardShortcut['category']): KeyboardShortcut[] => {
  return KEYBOARD_SHORTCUTS.filter(shortcut => shortcut.category === category);
};

export const getShortcutByAction = (action: string): KeyboardShortcut | undefined => {
  return KEYBOARD_SHORTCUTS.find(shortcut => shortcut.action === action);
};

export const matchesShortcut = (event: KeyboardEvent, shortcut: KeyboardShortcut): boolean => {
  return (
    event.key === shortcut.key ||
    (shortcut.key === 'ContextMenu' && event.key === 'ContextMenu') ||
    (shortcut.key === 'Click' && event.type === 'click')
  ) &&
    !!event.ctrlKey === !!shortcut.ctrlKey &&
    !!event.altKey === !!shortcut.altKey &&
    !!event.shiftKey === !!shortcut.shiftKey &&
    !!event.metaKey === !!shortcut.metaKey;
};

export const isModifierKey = (event: KeyboardEvent): boolean => {
  return event.ctrlKey || event.altKey || event.shiftKey || event.metaKey;
};

export const isNavigationKey = (event: KeyboardEvent): boolean => {
  const navigationKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'];
  return navigationKeys.includes(event.key) && !isModifierKey(event);
};

export const isEditingKey = (event: KeyboardEvent): boolean => {
  const editingKeys = ['Enter', 'F2', 'Delete', 'Insert', 'Backspace'];
  return editingKeys.includes(event.key) && !isModifierKey(event);
};

export const isSelectKey = (event: KeyboardEvent): boolean => {
  return event.key === ' ' && !isModifierKey(event);
};

export const isEscapeKey = (event: KeyboardEvent): boolean => {
  return event.key === 'Escape';
};

export const isSearchKey = (event: KeyboardEvent): boolean => {
  return (event.ctrlKey || event.metaKey) && (event.key === 'f' || event.key === '/');
};