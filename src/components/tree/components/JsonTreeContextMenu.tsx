"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  Cut, 
  Paste, 
  Download,
  Eye,
  EyeOff,
  ChevronRight
} from 'lucide-react';
import { JsonTreeContextMenuProps, ContextMenuAction, JsonNode, MenuContext, JsonTreeMenuRef } from '../types/json.types';

const DEFAULT_ACTIONS: ContextMenuAction[] = [
  {
    id: 'edit',
    label: 'Edit',
    icon: 'edit',
    shortcut: 'Enter',
    action: () => {
      // Handle edit
    },
  },
  {
    id: 'add',
    label: 'Add',
    icon: 'add',
    action: () => {
      // Handle add
    },
    submenu: [
      {
        id: 'add-property',
        label: 'Property',
        action: () => {
          // Handle add property
        },
      },
      {
        id: 'add-array-item',
        label: 'Array Item',
        action: () => {
          // Handle add array item
        },
      },
    ],
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: 'delete',
    shortcut: 'Delete',
    action: () => {
      // Handle delete
    },
  },
  { id: 'separator-1', label: '', action: () => {}, separator: true },
  {
    id: 'copy',
    label: 'Copy',
    icon: 'copy',
    shortcut: 'Ctrl+C',
    action: () => {
      // Handle copy
    },
  },
  {
    id: 'cut',
    label: 'Cut',
    icon: 'cut',
    shortcut: 'Ctrl+X',
    action: () => {
      // Handle cut
    },
  },
  {
    id: 'paste',
    label: 'Paste',
    icon: 'paste',
    shortcut: 'Ctrl+V',
    disabled: true, // Enable when clipboard has data
    action: () => {
      // Handle paste
    },
  },
  { id: 'separator-2', label: '', action: () => {}, separator: true },
  {
    id: 'expand',
    label: 'Expand All',
    icon: 'expand',
    action: () => {
      // Handle expand all
    },
  },
  {
    id: 'collapse',
    label: 'Collapse All',
    icon: 'collapse',
    action: () => {
      // Handle collapse all
    },
  },
  { id: 'separator-3', label: '', action: () => {}, separator: true },
  {
    id: 'export',
    label: 'Export',
    icon: 'export',
    action: () => {},
    submenu: [
      {
        id: 'export-json',
        label: 'As JSON',
        action: () => {
          // Handle export JSON
        },
      },
      {
        id: 'export-yaml',
        label: 'As YAML',
        action: () => {
          // Handle export YAML
        },
      },
    ],
  },
];

export const JsonTreeContextMenu: React.FC<JsonTreeContextMenuProps> = ({
  actions = DEFAULT_ACTIONS,
  onAction,
  className = '',
  testId = 'json-tree-context-menu',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetNode, setTargetNode] = useState<JsonNode | null>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Show context menu
  const showMenu = useCallback((event: MouseEvent, node: JsonNode) => {
    event.preventDefault();
    event.stopPropagation();
    
    setPosition({ x: event.clientX, y: event.clientY });
    setTargetNode(node);
    setIsVisible(true);
    setActiveSubmenu(null);
  }, []);

  // Hide context menu
  const hideMenu = useCallback(() => {
    setIsVisible(false);
    setTargetNode(null);
    setActiveSubmenu(null);
  }, []);

  // Handle action click
  const handleActionClick = useCallback((action: ContextMenuAction, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (action.submenu) {
      setActiveSubmenu(activeSubmenu === action.id ? null : action.id);
    } else if (targetNode) {
      const context: MenuContext = {
        event: event.nativeEvent as MouseEvent,
        tree: {} as JsonTreeMenuRef, // Pass tree ref
        selectedNodes: [targetNode],
        clipboard: undefined,
      };
      
      action.action(targetNode, context);
      onAction?.(action.id, targetNode);
      hideMenu();
    }
  }, [targetNode, activeSubmenu, onAction, hideMenu]);

  // Handle submenu hover
  const handleSubmenuEnter = useCallback((actionId: string) => {
    setActiveSubmenu(actionId);
  }, []);

  // Handle submenu leave
  const handleSubmenuLeave = useCallback(() => {
    setActiveSubmenu(null);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        hideMenu();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hideMenu();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, hideMenu]);

  // Adjust position if menu goes off-screen
  useEffect(() => {
    if (isVisible && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let adjustedX = position.x;
      let adjustedY = position.y;
      
      if (rect.right > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 10;
      }
      
      if (rect.bottom > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 10;
      }
      
      if (adjustedX !== position.x || adjustedY !== position.y) {
        setPosition({ x: adjustedX, y: adjustedY });
      }
    }
  }, [isVisible, position]);

  // Get icon component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'edit': return <Edit3 className="w-4 h-4" />;
      case 'add': return <Plus className="w-4 h-4" />;
      case 'delete': return <Trash2 className="w-4 h-4" />;
      case 'copy': return <Copy className="w-4 h-4" />;
      case 'cut': return <Cut className="w-4 h-4" />;
      case 'paste': return <Paste className="w-4 h-4" />;
      case 'export': return <Download className="w-4 h-4" />;
      case 'expand': return <Eye className="w-4 h-4" />;
      case 'collapse': return <EyeOff className="w-4 h-4" />;
      default: return null;
    }
  };

  // Expose showMenu method
  // Expose methods via ref if needed
  const menuRefExposed = React.useRef({
    showMenu,
    hideMenu,
  });

  // Note: onAction prop is for handling context menu actions, not for exposing methods

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          className={`
            fixed bg-[#1a1a22] border border-gray-700 rounded-lg shadow-lg py-1 z-50 min-w-48
            ${className}
          `}
          style={{ x: position.x, y: position.y }}
          data-testid={testId}
        >
          {actions.map((action, index) => {
            if (action.separator) {
              return (
                <div
                  key={`separator-${index}`}
                  className="h-px bg-gray-700 my-1"
                />
              );
            }

            const isActive = activeSubmenu === action.id;
            const hasSubmenu = action.submenu && action.submenu.length > 0;

            return (
              <div key={action.id} className="relative">
                <button
                  onClick={(e) => handleActionClick(action, e)}
                  onMouseEnter={() => hasSubmenu && handleSubmenuEnter(action.id)}
                  onMouseLeave={handleSubmenuLeave}
                  disabled={action.disabled}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 text-left transition-colors
                    ${action.disabled 
                      ? 'text-gray-600 cursor-not-allowed' 
                      : 'text-gray-300 hover:bg-white/[0.05] hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    {action.icon && getIcon(action.icon)}
                    <span className="text-sm">{action.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {action.shortcut && (
                      <span className="text-xs text-gray-500">
                        {action.shortcut}
                      </span>
                    )}
                    {hasSubmenu && (
                      <ChevronRight className="w-3 h-3 text-gray-500" />
                    )}
                  </div>
                </button>

                {/* Submenu */}
                <AnimatePresence>
                  {isActive && hasSubmenu && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute left-full top-0 ml-1 bg-[#1a1a22] border border-gray-700 rounded-lg shadow-lg py-1 min-w-48 z-10"
                    >
                      {action.submenu?.map((submenuAction) => (
                        <button
                          key={submenuAction.id}
                          onClick={(e) => handleActionClick(submenuAction, e)}
                          disabled={submenuAction.disabled}
                          className={`
                            w-full flex items-center justify-between px-3 py-2 text-left transition-colors
                            ${submenuAction.disabled 
                              ? 'text-gray-600 cursor-not-allowed' 
                              : 'text-gray-300 hover:bg-white/[0.05] hover:text-white'
                            }
                          `}
                        >
                          <div className="flex items-center gap-2">
                            {submenuAction.icon && getIcon(submenuAction.icon)}
                            <span className="text-sm">{submenuAction.label}</span>
                          </div>
                          
                          {submenuAction.shortcut && (
                            <span className="text-xs text-gray-500">
                              {submenuAction.shortcut}
                            </span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JsonTreeContextMenu;