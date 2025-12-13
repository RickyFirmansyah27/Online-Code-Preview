import { useCallback } from 'react';
import { JsonNode, JsonValue } from '../types/json.types';
import { parseValue, validateValueParse } from './nodeUtils';

export interface NodeHandlersProps {
  node: JsonNode;
  onToggle: (path: string) => void;
  onSelect: (path: string) => void;
  onEdit: (path: string, value: JsonValue) => void;
  onDelete: (path: string) => void;
  onContextMenu?: (event: MouseEvent, node: JsonNode) => void;
  onDragStart?: (event: DragEvent, node: JsonNode) => void;
  onDragEnd?: (event: DragEvent, node: JsonNode) => void;
  onDrop?: (event: DragEvent, target: JsonNode, position: string) => void;
}

export interface NodeEditState {
  isInlineEditing: boolean;
  editValue: string;
  setIsInlineEditing: (value: boolean) => void;
  setEditValue: (value: string) => void;
}

export interface NodeHandlersReturn {
  handleToggle: (event: React.MouseEvent) => void;
  handleSelect: (event: React.MouseEvent) => void;
  handleEditStart: (event?: React.MouseEvent) => void;
  handleEditSubmit: () => void;
  handleEditCancel: () => void;
  handleContextMenu: (event: React.MouseEvent) => void;
  handleDragStart: (event: React.DragEvent) => void;
  handleDragEnd: (event: React.DragEvent) => void;
  handleDrop: (event: React.DragEvent, dropPosition?: string) => void;
  handleDragOver: (event: React.DragEvent) => void;
  handleCopyValue: () => void;
  handleDelete: () => void;
}

/**
 * Custom hook for handling all node-related events
 */
export const useNodeHandlers = (
  props: NodeHandlersProps,
  editState: NodeEditState
): NodeHandlersReturn => {
  const { node, onToggle, onSelect, onEdit, onDelete, onContextMenu, onDragStart, onDragEnd, onDrop } = props;
  const { isInlineEditing, editValue, setIsInlineEditing, setEditValue } = editState;

  // Handle node toggle
  const handleToggle = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    if (node.type === 'object' || node.type === 'array') {
      onToggle(node.path);
    }
  }, [node.type, node.path, onToggle]);

  // Handle node selection
  const handleSelect = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onSelect(node.path);
  }, [node.path, onSelect]);

  // Handle starting an edit
  const handleEditStart = useCallback((event?: React.MouseEvent) => {
    event?.stopPropagation();
    event?.preventDefault();
    if (node.type !== 'object' && node.type !== 'array') {
      setEditValue(String(node.value));
      setIsInlineEditing(true);
    }
  }, [node.type, node.value, setEditValue, setIsInlineEditing]);

  // Handle edit submission
  const handleEditSubmit = useCallback(() => {
    if (!isInlineEditing) return;

    const validation = validateValueParse(editValue, node.type);
    
    if (!validation.isValid) {
      console.error('Invalid value during edit:', validation.error);
      setIsInlineEditing(false);
      return;
    }

    try {
      const parsedValue = parseValue(editValue, node.type);
      onEdit(node.path, parsedValue);
    } catch (error) {
      console.error('Error parsing value during edit:', error);
    } finally {
      setIsInlineEditing(false);
    }
  }, [editValue, node.path, node.type, isInlineEditing, onEdit, setIsInlineEditing]);

  // Handle edit cancellation
  const handleEditCancel = useCallback(() => {
    setIsInlineEditing(false);
  }, [setIsInlineEditing]);

  // Handle context menu
  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onContextMenu?.(event.nativeEvent, node);
  }, [onContextMenu, node]);

  // Handle drag start
  const handleDragStart = useCallback((event: React.DragEvent) => {
    onDragStart?.(event.nativeEvent, node);
  }, [onDragStart, node]);

  // Handle drag end
  const handleDragEnd = useCallback((event: React.DragEvent) => {
    onDragEnd?.(event.nativeEvent, node);
  }, [onDragEnd, node]);

  // Handle drop
  const handleDrop = useCallback((event: React.DragEvent, dropPosition?: string) => {
    event.preventDefault();
    event.stopPropagation();
    onDrop?.(event.nativeEvent, node, dropPosition || 'inside');
  }, [onDrop, node]);

  // Handle drag over
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  // Handle copy value to clipboard
  const handleCopyValue = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(node.value, null, 2))
      .catch(error => {
        console.error('Failed to copy to clipboard:', error);
      });
  }, [node.value]);

  // Handle delete node
  const handleDelete = useCallback(() => {
    onDelete(node.path);
  }, [node.path, onDelete]);

  return {
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
    handleCopyValue: handleCopyValue,
    handleDelete: handleDelete,
  };
};

/**
 * Handles keyboard events for the edit input
 */
export const handleEditInputKeyDown = (
  event: React.KeyboardEvent,
  onSubmit: () => void,
  onCancel: () => void
): void => {
  switch (event.key) {
    case 'Enter':
      event.preventDefault();
      onSubmit();
      break;
    case 'Escape':
      event.preventDefault();
      onCancel();
      break;
    default:
      // Allow other keys
      break;
  }
};