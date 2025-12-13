import React, { useState, useRef, useEffect } from 'react';
import { JsonTreeNodeProps } from '../types/json.types';
import { useNodeHandlers, NodeHandlersProps, NodeEditState } from '../utils/nodeHandlers';
import JsonTreeNodeContent from './JsonTreeNodeContent';
import JsonTreeNodeDropIndicators from './JsonTreeNodeDropIndicators';

/**
 * JsonTreeNode component - A modular and clean implementation
 * 
 * This component renders a single node in the JSON tree with support for:
 * - Expand/collapse functionality
 * - Inline editing
 * - Drag and drop
 * - Context menu
 * - Selection and highlighting
 */
const JsonTreeNode: React.FC<JsonTreeNodeProps> = ({
  node,
  level,
  isExpanded,
  isSelected,
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
  // State for inline editing
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [editValue, setEditValue] = useState<string>('');
  
  // Refs for DOM elements
  const nodeRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Edit state object for the handlers hook
  const editState: NodeEditState = {
    isInlineEditing,
    editValue,
    setIsInlineEditing,
    setEditValue,
  };

  // Handlers props for the handlers hook
  const handlersProps: NodeHandlersProps = {
    node,
    onToggle,
    onSelect,
    onEdit,
    onDelete,
    onContextMenu,
    onDragStart,
    onDragEnd,
    onDrop,
  };

  // Get all event handlers from the custom hook
  const {
    handleToggle,
    handleSelect,
    handleEditStart,
    handleEditSubmit,
    handleEditCancel,
    handleContextMenu,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDragOver,
    handleCopyValue,
    handleDelete,
  } = useNodeHandlers(handlersProps, editState);

  // Focus edit input when editing starts
  useEffect(() => {
    if (isInlineEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isInlineEditing]);

  // Handle drag events
  const handleNodeDragStart = (event: React.DragEvent) => {
    handleDragStart(event);
  };

  const handleNodeDragEnd = (event: React.DragEvent) => {
    handleDragEnd(event);
  };

  const handleNodeDrop = (event: React.DragEvent) => {
    handleDrop(event, dropPosition);
  };

  const handleNodeDragOver = (event: React.DragEvent) => {
    handleDragOver(event);
  };

  // Handle edit value change
  const handleEditValueChange = (value: string) => {
    setEditValue(value);
  };

  return (
    <div
      className={`
        relative group select-none
        ${isDragging ? 'opacity-50' : ''}
        ${className}
      `}
      draggable={false}
      onDragStart={handleNodeDragStart}
      onDragEnd={handleNodeDragEnd}
      onDrop={handleNodeDrop}
      onDragOver={handleNodeDragOver}
    >
      {/* Drop indicators */}
      <JsonTreeNodeDropIndicators
        isDropTarget={isDropTarget}
        dropPosition={dropPosition}
      />

      {/* Node content */}
      <JsonTreeNodeContent
        node={node}
        level={level}
        isExpanded={isExpanded}
        isSelected={isSelected}
        isInlineEditing={isInlineEditing}
        editValue={editValue}
        showTypes={showTypes}
        showSizes={showSizes}
        showLineNumbers={showLineNumbers}
        animationDuration={animationDuration}
        nodeRef={nodeRef}
        editInputRef={editInputRef}
        onToggle={handleToggle}
        onSelect={handleSelect}
        onEditStart={handleEditStart}
        onEditSubmit={handleEditSubmit}
        onEditCancel={handleEditCancel}
        onEditValueChange={handleEditValueChange}
        onCopyValue={handleCopyValue}
        onDelete={handleDelete}
        onContextMenu={handleContextMenu}
        className={isDropTarget ? 'bg-green-500/20' : ''}
        testId={testId}
      />
    </div>
  );
};

export default JsonTreeNode;
export { JsonTreeNode };