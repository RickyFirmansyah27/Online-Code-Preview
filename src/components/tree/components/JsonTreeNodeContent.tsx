import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Edit3, Copy, Trash2 } from 'lucide-react';
import { JsonNode } from '../types/json.types';
import { 
  getNodeIcon, 
  getValueDisplay, 
  getValueColor, 
  getSizeDisplay, 
  hasChildren, 
  isEditable 
} from '../utils/nodeUtils';
import { handleEditInputKeyDown } from '../utils/nodeHandlers';

interface JsonTreeNodeContentProps {
  node: JsonNode;
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
  isInlineEditing: boolean;
  editValue: string;
  showTypes: boolean;
  showSizes: boolean;
  showLineNumbers: boolean;
  animationDuration: number;
  nodeRef: React.RefObject<HTMLDivElement>;
  editInputRef: React.RefObject<HTMLInputElement>;
  onToggle: (event: React.MouseEvent) => void;
  onSelect: (event: React.MouseEvent) => void;
  onEditStart: (event?: React.MouseEvent) => void;
  onEditSubmit: () => void;
  onEditCancel: () => void;
  onEditValueChange: (value: string) => void;
  onCopyValue: () => void;
  onDelete: () => void;
  onContextMenu: (event: React.MouseEvent) => void;
  className?: string;
  testId?: string;
}

export const JsonTreeNodeContent: React.FC<JsonTreeNodeContentProps> = ({
  node,
  level,
  isExpanded,
  isSelected,
  isInlineEditing,
  editValue,
  showTypes,
  showSizes,
  showLineNumbers,
  animationDuration,
  nodeRef,
  editInputRef,
  onToggle,
  onSelect,
  onEditStart,
  onEditSubmit,
  onEditCancel,
  onEditValueChange,
  onCopyValue,
  onDelete,
  onContextMenu,
  className = '',
  testId = `json-tree-node-${node.path}`,
}) => {
  const nodeHasChildren = hasChildren(node.type);
  const indent = level * 20;

  return (
    <div
      ref={nodeRef}
      className={`
        relative group select-none
        ${isSelected ? 'bg-blue-500/10' : ''}
        ${className}
      `}
      style={{ paddingLeft: `${indent}px` }}
      data-testid={testId}
      onClick={onSelect}
      onContextMenu={onContextMenu}
      onDoubleClick={() => onEditStart()}
      draggable={false}
    >
      {/* Node content */}
      <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-white/[0.02] transition-colors">
        {/* Expand/Collapse toggle */}
        {nodeHasChildren && (
          <motion.button
            onClick={onToggle}
            className="p-0.5 hover:bg-white/[0.1] rounded transition-colors"
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: animationDuration / 1000 }}
          >
            <ChevronRight className="w-3 h-3 text-gray-400" />
          </motion.button>
        )}
        {!nodeHasChildren && <div className="w-4"></div>}

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
        {isInlineEditing && isEditable(node.type) ? (
          <input
            ref={editInputRef}
            type="text"
            value={editValue}
            onChange={(e) => onEditValueChange(e.target.value)}
            onKeyDown={(e) => handleEditInputKeyDown(e, onEditSubmit, onEditCancel)}
            onBlur={onEditSubmit}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-[#1e1e2e] text-gray-200 text-sm px-2 py-0.5 rounded border border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        ) : (
          <span 
            className={`text-sm ${getValueColor(node.type)} flex-1`} 
            onDoubleClick={() => onEditStart()}
          >
            {getValueDisplay(node.value, node.type)}
          </span>
        )}

        {/* Size indicator */}
        {showSizes && nodeHasChildren && (
          <span className="text-xs text-gray-500">
            {getSizeDisplay(node.value, node.type)}
          </span>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isInlineEditing && isEditable(node.type) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onEditStart(e);
              }}
              className="p-1 hover:bg-white/[0.1] rounded transition-colors"
              title="Edit value"
            >
              <Edit3 className="w-3 h-3 text-gray-400" />
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopyValue();
            }}
            className="p-1 hover:bg-white/[0.1] rounded transition-colors"
            title="Copy value"
          >
            <Copy className="w-3 h-3 text-gray-400" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-red-500/20 rounded transition-colors"
            title="Delete node"
          >
            <Trash2 className="w-3 h-3 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonTreeNodeContent;