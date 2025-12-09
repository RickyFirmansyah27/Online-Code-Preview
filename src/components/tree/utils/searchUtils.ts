/**
 * Search utilities for JSON tree menu
 */

import { JsonNode, SearchResult, SearchMatch, JsonNodeType } from '../types/json.types';
import { getJsonValueDisplay } from './jsonUtils';

/**
 * Search options interface
 */
export interface SearchOptions {
  caseSensitive?: boolean;
  exactMatch?: boolean;
  includeKeys?: boolean;
  includeValues?: boolean;
  regex?: boolean;
  maxResults?: number;
}

/**
 * Default search options
 */
export const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  caseSensitive: false,
  exactMatch: false,
  includeKeys: true,
  includeValues: true,
  regex: false,
  maxResults: 1000,
};

/**
 * Escape regex special characters
 */
export const escapeRegex = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Create search regex from query and options
 */
export const createSearchRegex = (query: string, options: SearchOptions): RegExp => {
  let pattern = query;
  
  if (!options.regex) {
    pattern = escapeRegex(pattern);
  }
  
  if (!options.exactMatch) {
    pattern = `.*${pattern}.*`;
  }
  
  const flags = options.caseSensitive ? 'g' : 'gi';
  
  try {
    return new RegExp(pattern, flags);
  } catch {
    // Fallback to simple string search if regex is invalid
    return new RegExp(escapeRegex(query), flags);
  }
};

/**
 * Check if a string matches the search criteria
 */
export const matchesSearch = (text: string, query: string, options: SearchOptions): boolean => {
  if (!text || !query) return false;
  
  if (options.regex) {
    try {
      const regex = createSearchRegex(query, options);
      return regex.test(text);
    } catch {
      return false;
    }
  }
  
  const searchText = options.caseSensitive ? text : text.toLowerCase();
  const searchQuery = options.caseSensitive ? query : query.toLowerCase();
  
  if (options.exactMatch) {
    return searchText === searchQuery;
  }
  
  return searchText.includes(searchQuery);
};

/**
 * Get all matches in a string with positions
 */
export const getMatchesInString = (text: string, query: string, options: SearchOptions): SearchMatch[] => {
  const matches: SearchMatch[] = [];
  
  if (!text || !query) return matches;
  
  const regex = createSearchRegex(query, options);
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    matches.push({
      path: '',
      key: '',
      value: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }
  
  return matches;
};

/**
 * Calculate search score for a match
 */
export const calculateSearchScore = (match: SearchMatch, query: string, options: SearchOptions): number => {
  let score = 0;
  
  // Exact match gets highest score
  if (options.exactMatch && match.value === query) {
    score += 100;
  }
  
  // Key matches are more important than value matches
  if (match.keyMatch) {
    score += 50;
  }
  
  // Shorter matches get higher scores
  const lengthRatio = 1 - (match.value.length / Math.max(query.length, 1));
  score += lengthRatio * 30;
  
  // Position in string (earlier is better)
  if (match.startIndex !== undefined) {
    const positionScore = Math.max(0, 20 - match.startIndex / 10);
    score += positionScore;
  }
  
  return score;
};

/**
 * Search in a single JSON node
 */
export const searchNode = (
  node: JsonNode,
  query: string,
  options: SearchOptions,
  path: string = ''
): SearchResult[] => {
  const results: SearchResult[] = [];
  const nodePath = path || node.path;
  const matches: SearchMatch[] = [];
  
  // Search in key
  if (options.includeKeys && node.key) {
    if (matchesSearch(node.key, query, options)) {
      const keyMatches = getMatchesInString(node.key, query, options);
      keyMatches.forEach(match => {
        matches.push({
          ...match,
          path: nodePath,
          key: node.key,
          keyMatch: true,
        });
      });
    }
  }
  
  // Search in value
  if (options.includeValues && node.type !== 'object' && node.type !== 'array') {
    const valueDisplay = getJsonValueDisplay(node.value, node.type);
    if (matchesSearch(valueDisplay, query, options)) {
      const valueMatches = getMatchesInString(valueDisplay, query, options);
      valueMatches.forEach(match => {
        matches.push({
          ...match,
          path: nodePath,
          key: node.key,
          valueMatch: true,
        });
      });
    }
  }
  
  // Create search result if we have matches
  if (matches.length > 0) {
    const score = Math.max(...matches.map(match => calculateSearchScore(match, query, options)));
    
    results.push({
      node,
      matches,
      score,
    });
  }
  
  // Search in children
  if (node.children) {
    for (const child of node.children) {
      results.push(...searchNode(child, query, options, nodePath));
    }
  }
  
  return results;
};

/**
 * Search entire JSON tree
 */
export const searchTree = (
  rootNode: JsonNode,
  query: string,
  options: SearchOptions = DEFAULT_SEARCH_OPTIONS
): SearchResult[] => {
  if (!rootNode || !query.trim()) {
    return [];
  }
  
  const allResults = searchNode(rootNode, query, options);
  
  // Sort by score (descending)
  allResults.sort((a, b) => b.score - a.score);
  
  // Limit results
  if (options.maxResults && options.maxResults > 0) {
    return allResults.slice(0, options.maxResults);
  }
  
  return allResults;
};

/**
 * Highlight search matches in text
 */
export const highlightMatches = (
  text: string,
  matches: SearchMatch[],
  highlightClass: string = 'bg-yellow-300 text-black'
): string => {
  if (!matches.length) return text;
  
  // Sort matches by start position
  const sortedMatches = [...matches].sort((a, b) => (a.startIndex || 0) - (b.startIndex || 0));
  
  let result = '';
  let lastIndex = 0;
  
  for (const match of sortedMatches) {
    if (match.startIndex !== undefined && match.endIndex !== undefined) {
      // Add text before match
      result += text.slice(lastIndex, match.startIndex);
      
      // Add highlighted match
      result += `<span class="${highlightClass}">${text.slice(match.startIndex, match.endIndex)}</span>`;
      
      lastIndex = match.endIndex;
    }
  }
  
  // Add remaining text
  result += text.slice(lastIndex);
  
  return result;
};

/**
 * Get search suggestions based on current query
 */
export const getSearchSuggestions = (
  rootNode: JsonNode,
  query: string,
  options: SearchOptions = DEFAULT_SEARCH_OPTIONS,
  maxSuggestions: number = 10
): string[] => {
  const suggestions = new Set<string>();
  const lowerQuery = query.toLowerCase();
  
  const collectSuggestions = (node: JsonNode) => {
    // Add key suggestions
    if (options.includeKeys && node.key) {
      const lowerKey = node.key.toLowerCase();
      if (lowerKey.includes(lowerQuery) && node.key !== query) {
        suggestions.add(node.key);
      }
    }
    
    // Add value suggestions for primitive types
    if (options.includeValues && node.type !== 'object' && node.type !== 'array') {
      const valueDisplay = getJsonValueDisplay(node.value, node.type);
      const lowerValue = valueDisplay.toLowerCase();
      if (lowerValue.includes(lowerQuery) && valueDisplay !== query) {
        suggestions.add(valueDisplay);
      }
    }
    
    // Recursively check children
    if (node.children) {
      node.children.forEach(collectSuggestions);
    }
  };
  
  collectSuggestions(rootNode);
  
  return Array.from(suggestions).slice(0, maxSuggestions);
};

/**
 * Filter search results by type
 */
export const filterResultsByType = (
  results: SearchResult[],
  types: JsonNodeType[]
): SearchResult[] => {
  return results.filter(result => types.includes(result.node.type));
};

/**
 * Filter search results by path pattern
 */
export const filterResultsByPath = (
  results: SearchResult[],
  pathPattern: RegExp
): SearchResult[] => {
  return results.filter(result => pathPattern.test(result.node.path));
};

/**
 * Get unique paths from search results
 */
export const getUniquePaths = (results: SearchResult[]): string[] => {
  const paths = new Set<string>();
  results.forEach(result => paths.add(result.node.path));
  return Array.from(paths);
};

/**
 * Group search results by type
 */
export const groupResultsByType = (results: SearchResult[]): Record<JsonNodeType, SearchResult[]> => {
  const groups: Record<JsonNodeType, SearchResult[]> = {
    object: [],
    array: [],
    string: [],
    number: [],
    boolean: [],
    null: [],
  };
  
  results.forEach(result => {
    groups[result.node.type].push(result);
  });
  
  return groups;
};

/**
 * Get search statistics
 */
export const getSearchStats = (results: SearchResult[]) => {
  const stats = {
    totalResults: results.length,
    totalMatches: results.reduce((sum, result) => sum + result.matches.length, 0),
    averageScore: results.length > 0 ? results.reduce((sum, result) => sum + result.score, 0) / results.length : 0,
    typeDistribution: {} as Record<JsonNodeType, number>,
  };
  
  results.forEach(result => {
    stats.typeDistribution[result.node.type] = (stats.typeDistribution[result.node.type] || 0) + 1;
  });
  
  return stats;
};

/**
 * Validate search query
 */
export const validateSearchQuery = (query: string, options: SearchOptions): { isValid: boolean; error?: string } => {
  if (!query.trim()) {
    return { isValid: false, error: 'Search query cannot be empty' };
  }
  
  if (options.regex) {
    try {
      new RegExp(query);
    } catch {
      return { isValid: false, error: 'Invalid regular expression' };
    }
  }
  
  return { isValid: true };
};

/**
 * Normalize search query
 */
export const normalizeSearchQuery = (query: string, options: SearchOptions): string => {
  if (!query) return '';
  
  let normalized = query.trim();
  
  if (!options.caseSensitive) {
    normalized = normalized.toLowerCase();
  }
  
  return normalized;
};