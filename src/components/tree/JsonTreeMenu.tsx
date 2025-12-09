"use client";

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useJsonTree } from './hooks/useJsonTree';
import { JsonTreeNode } from './components/JsonTreeNode';
import { JsonTreeSearch } from './components/JsonTreeSearch';
import { JsonTreeBreadcrumb } from './components/JsonTreeBreadcrumb';
import { JsonTreeContextMenu } from './components/JsonTreeContextMenu';
import { JsonTreeValidation } from './components/JsonTreeValidation';
import { JsonTreeExport } from './components/JsonTreeExport';
import { JsonTreeMenuProps, JsonNode, JsonFile, JsonValue, TreeViewMode, PathSegment, ExportOptions } from './types/json.types';
import { DEFAULT_TREE_CONFIG } from './constants/treeConstants';

export const JsonTreeMenu: React.FC<JsonTreeMenuProps> = ({
  files = [],
  activeFile,
  config = {},
  theme: _theme = {},
  readOnly = false,
  onFileSelect,
  onFileSave,
  onNodeSelect,
  onNodeEdit,
  onValidationError,
  viewMode: _viewMode = 'tree',
  editMode: _editMode = 'inline',
  showSearch = true,
  showBreadcrumb = true,
  showValidation = true,
  enableVirtualScrolling: _enableVirtualScrolling = false,
  className = '',
  testId = 'json-tree-menu',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<{ showMenu: (event: MouseEvent, node: JsonNode) => void } | null>(null);
  const [rawJsonContent, setRawJsonContent] = useState('');
  
  const mergedConfig = React.useMemo(() => ({ ...DEFAULT_TREE_CONFIG, ...config }), [config]);
  
  const {
    files: _treeFiles,
    activeFile: currentFile,
    rootNode,
    expandedNodes,
    selectedNodes,
    searchQuery,
    searchResults,
    viewMode: _currentViewMode,
    editMode: _currentEditMode,
    isLoading,
    error,
    validation,
    loadFile,
    saveFile,
    selectFile: _selectFile,
    toggleNode,
    expandAll,
    collapseAll,
    selectNode,
    editNode,
    addNode: _addNode,
    deleteNode,
    search,
    clearSearch,
    setViewMode,
    setEditMode: _setEditMode,
    validate: _validate,
    export: exportJson,
    import: _importJson,
    getNodeByPath,
    copyToClipboard: _copyToClipboard,
    focus: _focus,
  } = useJsonTree({
    files,
    activeFile,
    config: mergedConfig,
    onFileSelect,
    onFileSave,
    onNodeSelect,
    onNodeEdit,
    onValidationError,
  });

  // Handle file selection
  const _handleFileSelect = useCallback(async (file: JsonFile) => {
    await loadFile(file);
    onFileSelect?.(file);
  }, [loadFile, onFileSelect]);

  // Handle node interactions
  const _handleNodeToggle = useCallback((path: string) => {
    toggleNode(path);
  }, [toggleNode]);

  const _handleNodeSelect = useCallback((path: string, multi = false) => {
    selectNode(path, multi);
    const node = getNodeByPath(path);
    if (node) {
      onNodeSelect?.(node);
    }
  }, [selectNode, getNodeByPath, onNodeSelect]);

  const _handleNodeEdit = useCallback((path: string, value: JsonValue) => {
    if (!readOnly) {
      // Auto-switch to raw mode for editing
      setViewMode('raw');
      editNode(path, value);
      onNodeEdit?.(getNodeByPath(path)!, value);
    }
  }, [readOnly, editNode, getNodeByPath, onNodeEdit, setViewMode]);

  const _handleNodeDelete = useCallback((path: string) => {
    if (!readOnly) {
      deleteNode(path);
    }
  }, [readOnly, deleteNode]);

  // Handle search
  const _handleSearch = useCallback((query: string) => {
    search(query);
  }, [search]);

  const _handleSearchClear = useCallback(() => {
    clearSearch();
  }, [clearSearch]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'f':
            event.preventDefault();
            (containerRef.current?.querySelector('input[type="search"]') as HTMLInputElement)?.focus();
            break;
          case 'e':
            event.preventDefault();
            expandAll();
            break;
          case 'w':
            event.preventDefault();
            collapseAll();
            break;
          case 's':
            event.preventDefault();
            if (currentFile && !readOnly) {
              saveFile(currentFile);
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [expandAll, collapseAll, saveFile, currentFile, readOnly]);

  // Handle context menu
  const _handleContextMenu = useCallback((event: MouseEvent, node: JsonNode) => {
    if (contextMenuRef.current) {
      contextMenuRef.current.showMenu(event, node);
    }
  }, []);

  // Initialize raw JSON content when file changes
  useEffect(() => {
    if (rootNode) {
      setRawJsonContent(JSON.stringify(rootNode.value, null, 2));
    }
  }, [rootNode]);

  // Handle raw JSON content change
  const handleRawJsonChange = useCallback((content: string) => {
    setRawJsonContent(content);
  }, []);

  // Handle raw JSON save
  const handleRawJsonSave = useCallback(() => {
    if (!currentFile || readOnly) return;
    
    try {
      const parsedData = JSON.parse(rawJsonContent);
      
      // Update the file content and parsed data
      const updatedFile: JsonFile = {
        ...currentFile,
        content: rawJsonContent,
        parsedData,
        isDirty: true,
        isValid: true,
        lastModified: new Date(),
      };
      
      // Trigger file save
      if (onFileSave) {
        onFileSave(updatedFile, rawJsonContent);
      }
      
      // Update the tree by reloading the file
      loadFile(updatedFile);
      
      alert('JSON updated successfully!');
    } catch (error) {
      alert(`Invalid JSON: ${error}`);
    }
  }, [rawJsonContent, currentFile, readOnly, onFileSave, loadFile]);

  // Render tree nodes with proper state passing
  const _renderTreeNodes = useCallback((nodes: JsonNode[], level = 0) => {
    return nodes.map((node) => {
      const isNodeExpanded = expandedNodes.has(node.path);
      const hasChildren = node.type === 'object' || node.type === 'array';
      
      return (
        <React.Fragment key={node.path}>
          <JsonTreeNode
            node={node}
            level={level}
            isExpanded={isNodeExpanded}
            isSelected={selectedNodes.has(node.path)}
            isEditing={node.isEditing || false}
            showTypes={mergedConfig.showTypes}
            showSizes={mergedConfig.showSizes}
            showLineNumbers={mergedConfig.showLineNumbers}
            animationDuration={mergedConfig.animationDuration}
            onToggle={_handleNodeToggle}
            onSelect={_handleNodeSelect}
            onEdit={_handleNodeEdit}
            onDelete={_handleNodeDelete}
            onContextMenu={_handleContextMenu}
          />
          {isNodeExpanded && hasChildren && node.children &&
            _renderTreeNodes(node.children, level + 1)
          }
        </React.Fragment>
      );
    });
  }, [expandedNodes, selectedNodes, mergedConfig, _handleNodeToggle, _handleNodeSelect, _handleNodeEdit, _handleNodeDelete, _handleContextMenu]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
        <p className="font-medium">Error loading JSON file</p>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] ${className}`}
      data-testid={testId}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium text-white">JSON Tree Editor</h2>
          {currentFile && (
            <span className="text-xs text-gray-400">
              {currentFile.name} {currentFile.isDirty && '*'}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* View mode selector */}
          <select
            value={_currentViewMode}
            onChange={(e) => setViewMode(e.target.value as TreeViewMode)}
            className="bg-[#1e1e2e] text-gray-200 text-xs px-2 py-1 rounded border border-white/[0.05]"
          >
            <option value="tree">Tree</option>
            <option value="raw">Raw</option>
            <option value="compact">Node</option>
          </select>
          
          {/* Actions */}
          {!readOnly && (
            <button
              onClick={() => currentFile && saveFile(currentFile)}
              disabled={!currentFile || !currentFile.isDirty}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
            >
              Save
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="p-4 border-b border-white/[0.05]">
          <JsonTreeSearch
            query={searchQuery}
            onQueryChange={_handleSearch}
            onClear={_handleSearchClear}
            results={searchResults}
            onResultSelect={(path: string) => _handleNodeSelect(path)}
            placeholder="Search JSON keys and values..."
            debounceMs={mergedConfig.searchDebounceMs}
            showResultCount={true}
            highlightMatches={true}
          />
        </div>
      )}

      {/* Breadcrumb */}
      {showBreadcrumb && selectedNodes.size > 0 && (
        <div className="p-4 border-b border-white/[0.05]">
          <JsonTreeBreadcrumb
            path={Array.from(selectedNodes)[0] || ''}
            onPathClick={(segment: PathSegment) => _handleNodeSelect(segment.key)}
            showHome={true}
            separator="/"
            maxSegments={5}
            truncateFrom="middle"
            showFullPath={false}
            enableCopy={true}
          />
        </div>
      )}

      {/* Validation Errors */}
      {showValidation && !validation.isValid && (
        <div className="p-4 border-b border-red-500/20">
          <JsonTreeValidation
            validation={validation}
            onFixError={(_error: unknown) => {
              // Handle error fix
            }}
            onDismiss={() => {
              // Handle dismiss
            }}
          />
        </div>
      )}

      {/* Tree Content */}
      <div className="relative overflow-auto" style={{ maxHeight: '600px' }}>
        {_currentViewMode === 'tree' && rootNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4"
          >
            {_renderTreeNodes([rootNode])}
          </motion.div>
        )}
        
        {_currentViewMode === 'raw' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-white">Raw JSON Editor</h3>
                {!readOnly && (
                  <button
                    onClick={handleRawJsonSave}
                    disabled={!currentFile}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
                  >
                    Save Changes
                  </button>
                )}
              </div>
              <textarea
                value={rawJsonContent}
                onChange={(e) => handleRawJsonChange(e.target.value)}
                placeholder="Enter your JSON content here..."
                rows={20}
                className="w-full h-96 bg-[#1e1e2e] text-gray-200 border border-gray-600 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                disabled={readOnly}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Context Menu */}
      <JsonTreeContextMenu
        ref={contextMenuRef}
        onAction={(actionId: string, node: JsonNode) => {
          switch (actionId) {
            case 'edit':
              // Auto-switch to raw mode for any edit action
              setViewMode('raw');
              if (node.type !== 'object' && node.type !== 'array') {
                _handleNodeEdit(node.path, node.value);
              }
              break;
            case 'copy':
              navigator.clipboard.writeText(JSON.stringify(node.value, null, 2));
              break;
            case 'delete':
              _handleNodeDelete(node.path);
              break;
            case 'expand':
              expandAll();
              break;
            case 'collapse':
              collapseAll();
              break;
            default:
              console.log('Unhandled action:', actionId);
          }
        }}
      />

      {/* Export Modal */}
      <JsonTreeExport
        onExport={async (options: ExportOptions) => {
          return await exportJson(options);
        }}
      />
    </div>
  );
};

export default JsonTreeMenu;