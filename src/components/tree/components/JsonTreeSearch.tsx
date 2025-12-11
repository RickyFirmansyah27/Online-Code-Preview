"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command } from 'lucide-react';
import { JsonTreeSearchProps, SearchResult } from '../types/json.types';

export const JsonTreeSearch: React.FC<JsonTreeSearchProps> = ({
  query,
  onQueryChange,
  onClear,
  results = [],
  onResultSelect,
  placeholder = "Search JSON keys and values...",
  showResultCount = true,
  maxResults = 100,
  showPath = true,
  className = '',
  testId = 'json-tree-search',
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle input change
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    onQueryChange(newQuery);
    setSelectedIndex(-1);
    setShowDropdown(newQuery.trim().length > 0);
  }, [onQueryChange]);

  // Handle clear
  const handleClear = useCallback(() => {
    onQueryChange('');
    onClear?.();
    setSelectedIndex(-1);
    setShowDropdown(false);
    inputRef.current?.focus();
  }, [onQueryChange, onClear]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          onResultSelect?.(results[selectedIndex].node.path);
          setShowDropdown(false); // Close dropdown after selecting with Enter
        }
        break;
      case 'Escape':
        event.preventDefault();
        handleClear();
        break;
    }
  }, [results, selectedIndex, onResultSelect, handleClear]);

  // Handle result click
  const handleResultClick = useCallback((result: SearchResult) => {
    onResultSelect?.(result.node.path);
    setShowDropdown(false); // Close dropdown after selecting
  }, [onResultSelect]);

  // Add keyboard event listener
  useEffect(() => {
    const element = inputRef.current;
    if (element) {
      element.addEventListener('keydown', handleKeyDown);
      return () => element.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  // Update dropdown visibility based on query and results
  useEffect(() => {
    if (query.trim().length > 0 && results.length > 0) {
      setShowDropdown(true);
    } else if (query.trim().length === 0) {
      setShowDropdown(false);
    }
  }, [query, results]);

  return (
    <div className={`relative ${className}`} data-testid={testId}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-2 bg-[#1a1a22] text-gray-200 text-sm rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {/* Right side controls */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Clear button */}
          {query && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-white/[0.1] rounded transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          
          {/* Keyboard shortcut hint */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Command className="w-3 h-3" />
            <span>F</span>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {showDropdown && query && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a22] border border-gray-700 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto"
          >
            {/* Result count */}
            {showResultCount && (
              <div className="px-3 py-2 border-b border-gray-700 bg-[#2a2a3a]">
                <span className="text-xs text-gray-400">
                  {results.length} result{results.length !== 1 ? 's' : ''} found
                </span>
              </div>
            )}
            
            {/* Result list */}
            <div className="py-1">
              {results.slice(0, maxResults).map((result: SearchResult, index: number) => (
                <div
                  key={result.node.path}
                  className={`
                    px-3 py-2 cursor-pointer transition-colors
                    ${index === selectedIndex ? 'bg-blue-500/20' : 'hover:bg-white/[0.05]'}
                  `}
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-center gap-2">
                    {/* Node icon */}
                    <span className="text-xs" aria-hidden="true">
                      {result.node.type === 'object' ? '📁' : 
                       result.node.type === 'array' ? '📋' : '📄'}
                    </span>
                    
                    {/* Key */}
                    <span className="text-sm text-gray-200 font-medium">
                      {result.node.key}
                    </span>
                    
                    {/* Value preview */}
                    {result.matches.some((m: { valueMatch?: boolean }) => m.valueMatch) && (
                      <span className="text-xs text-gray-400 truncate">
                        {String(result.node.value).substring(0, 50)}
                      </span>
                    )}
                  </div>
                  
                  {/* Path */}
                  {showPath && result.node.path && (
                    <div className="text-xs text-gray-500 mt-1 ml-6">
                      {result.node.path}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* More results indicator */}
            {results.length > maxResults && (
              <div className="px-3 py-2 border-t border-gray-700 bg-[#2a2a3a]">
                <span className="text-xs text-gray-400">
                  {results.length - maxResults} more results...
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* No results */}
      <AnimatePresence>
        {showDropdown && query && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a22] border border-gray-700 rounded-lg shadow-lg z-10 p-3"
          >
            <div className="text-center text-sm text-gray-400">
              No results found for &ldquo;{query}&rdquo;
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JsonTreeSearch;