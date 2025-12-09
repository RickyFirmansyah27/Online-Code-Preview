import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Trash2, Edit3, Copy } from 'lucide-react';
import { JsonTreeNodeProps, JsonValue } from '../types/json.types';

const getNodeIcon = (type: string, isExpanded: boolean) => {
  switch (type) {
    case 'object':
      return isExpanded ? '📂' : '📁';
    case 'array':
      return isExpanded ? '📋' : '📄';
    case 'string':
      return '📝';
    case 'number':
      return '🔢';
    case 'boolean':
      return '☑️';
    case 'null':
      return '⭕';
    default:
      return '❓';
  }
};

const getValueDisplay = (value: JsonValue, type: string): string => {
  switch (type) {
    case 'string':
      return `"${value}"`;
    case 'null':
      return 'null';
    case 'object':
      return `Object(${Object.keys(value as Record<string, unknown>).length})`;
    case 'array':
      return `Array(${(value as unknown[]).length})`;
    default:
      return String(value);
  }
};

const getValueColor = (type: string): string => {
  switch (type) {
    case 'string':
      return 'text-green-400';
    case 'number':
      return 'text-blue-400';
    case 'boolean':
      return 'text-yellow-400';
    case 'null':
      return 'text-gray-500';
    default:
      return 'text-gray-300';
  }
};

export const JsonTreeNode: React.FC<JsonTreeNodeProps> = ({
  node,
  level,
  isExpanded,
  isSelected,
  isEditing,
  isDragging = false,
  isDropTarget = false,
  dropPosition,
  showTypes = true,
  showSizes = false,
  showLineNumbers = false,
  animationDuration = 200,
  onToggle,
  onSelect,
  onEdit,
  onDelete,
  onContextMenu,
  onDragStart,
  onDragEnd,
  onDrop,
  className = '',
  testId = `json-tree-node-${node.path}`,
}) => {
  const [editValue, setEditValue] = useState<string>('');
  const nodeRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const hasChildren = node.type === 'object' || node.type === 'array';
  const indent = level * 20;

  // Handle node toggle
  const handleToggle = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    if (hasChildren) {
      onToggle(node.path);
    }
  }, [hasChildren, onToggle, node.path]);

  // Handle node selection
  const handleSelect = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onSelect(node.path);
  }, [onSelect, node.path]);

  // Handle editing
  const handleEdit = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    if (node.type !== 'object' && node.type !== 'array') {
      setEditValue(String(node.value));
      onEdit(node.path, node.value);
    }
  }, [node, onEdit]);

  const handleEditSubmit = useCallback(() => {
    try {
      let parsedValue: JsonValue = editValue;
      
      // Try to parse as JSON first
      if (editValue.startsWith('"') && editValue.endsWith('"')) {
        parsedValue = editValue.slice(1, -1);
      } else if (editValue === 'true') {
        parsedValue = true;
      } else if (editValue === 'false') {
        parsedValue = false;
      } else if (editValue === 'null') {
        parsedValue = null;
      } else if (!isNaN(Number(editValue))) {
        parsedValue = Number(editValue);
      }
      
      onEdit(node.path, parsedValue);
    } catch (error) {
      // Handle parse error
      console.error('Invalid JSON value:', error);
    }
  }, [editValue, onEdit, node.path]);

  const handleEditCancel = useCallback(() => {
    setEditValue('');
    // Cancel edit mode
  }, []);

  // Handle context menu
  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    // Context menu functionality disabled for now
    onContextMenu?.(event.nativeEvent, node);
  }, [onContextMenu, node]);

  // Handle drag and drop
  const handleDragStart = useCallback((event: React.DragEvent) => {
    // Drag and drop functionality disabled for now
    onDragStart?.(event.nativeEvent, node);
  }, [onDragStart, node]);

  const handleDragEnd = useCallback((event: React.DragEvent) => {
    // Drag and drop functionality disabled for now
    onDragEnd?.(event.nativeEvent, node);
  }, [onDragEnd, node]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    // Drag and drop functionality disabled for now
    onDrop?.(event.nativeEvent, node, dropPosition || 'inside');
  }, [onDrop, node, dropPosition]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  // Focus edit input when editing starts
  React.useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  return (
    <div
      ref={nodeRef}
      className={`
        relative group select-none
        ${isSelected ? 'bg-blue-500/10' : ''}
        ${isDropTarget ? 'bg-green-500/20' : ''}
        ${isDragging ? 'opacity-50' : ''}
        ${className}
      `}
      style={{ paddingLeft: `${indent}px` }}
      data-testid={testId}
      onClick={handleSelect}
      onContextMenu={handleContextMenu}
      draggable={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Drop indicator */}
      {isDropTarget && dropPosition === 'before' && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-500"></div>
      )}
      {isDropTarget && dropPosition === 'after' && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"></div>
      )}

      {/* Node content */}
      <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-white/[0.02] transition-colors">
        {/* Expand/Collapse toggle */}
        {hasChildren && (
          <motion.button
            onClick={handleToggle}
            className="p-0.5 hover:bg-white/[0.1] rounded transition-colors"
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: animationDuration / 1000 }}
          >
            <ChevronRight className="w-3 h-3 text-gray-400" />
          </motion.button>
        )}
        {!hasChildren && <div className="w-4"></div>}

        {/* Node icon */}
        <span className="text-sm" aria-hidden="true">
          {getNodeIcon(node.type, isExpanded)}
        </span>

        {/* Line number */}
        {showLineNumbers && (
          <span className="text-xs text-gray-500 font-mono w-8 text-right">
            {node.metadata?.index ?? ''}
          </span>
        )}

        {/* Key */}
        <span className="text-sm text-gray-200 font-medium">
          {node.key}
        </span>

        {/* Type indicator */}
        {showTypes && (
          <span className="text-xs text-gray-500 font-mono">
            {node.type}
          </span>
        )}

        {/* Value or edit input */}
        {isEditing && node.type !== 'object' && node.type !== 'array' ? (
          <input
            ref={editInputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEditSubmit();
              } else if (e.key === 'Escape') {
                handleEditCancel();
              }
            }}
            onBlur={handleEditSubmit}
            className="flex-1 bg-[#1e1e2e] text-gray-200 text-sm px-2 py-0.5 rounded border border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        ) : (
          <span className={`text-sm ${getValueColor(node.type)} flex-1`}>
            {getValueDisplay(node.value, node.type)}
          </span>
        )}

        {/* Size indicator */}
        {showSizes && hasChildren && (
          <span className="text-xs text-gray-500">
            {node.type === 'object'
              ? `{${Object.keys(node.value as Record<string, unknown>).length}}`
              : `[${(node.value as unknown[]).length}]`
            }
          </span>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing && node.type !== 'object' && node.type !== 'array' && (
            <button
              onClick={handleEdit}
              className="p-1 hover:bg-white/[0.1] rounded transition-colors"
              title="Edit value"
            >
              <Edit3 className="w-3 h-3 text-gray-400" />
            </button>
          )}
          
          <button
            onClick={() => navigator.clipboard.writeText(node.path)}
            className="p-1 hover:bg-white/[0.1] rounded transition-colors"
            title="Copy path"
          >
            <Copy className="w-3 h-3 text-gray-400" />
          </button>
          
          <button
            onClick={() => onDelete(node.path)}
            className="p-1 hover:bg-red-500/20 rounded transition-colors"
            title="Delete node"
          >
            <Trash2 className="w-3 h-3 text-red-400" />
          </button>
        </div>
      </div>

      {/* Children */}
      <AnimatePresence>
        {isExpanded && hasChildren && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: animationDuration / 1000 }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <JsonTreeNode
                key={child.path}
                node={child}
                level={level + 1}
                isExpanded={child.isExpanded || false}
                isSelected={child.isSelected || false}
                isEditing={child.isEditing || false}
                showTypes={showTypes}
                showSizes={showSizes}
                showLineNumbers={showLineNumbers}
                animationDuration={animationDuration}
                onToggle={onToggle}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={onDelete}
                onContextMenu={onContextMenu}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drop indicator for inside position */}
      {isDropTarget && dropPosition === 'inside' && (
        <div className="absolute inset-0 border-2 border-green-500 rounded pointer-events-none"></div>
      )}
    </div>
  );
};

export default JsonTreeNode;