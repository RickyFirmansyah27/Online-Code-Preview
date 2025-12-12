import { JsonTreeState } from '../types';

/**
 * Search operations actions
 */
export const createSearchActions = (set: (state: Partial<JsonTreeState>) => void, get: () => JsonTreeState) => ({
  /**
   * Set search query
   */
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  /**
   * Perform search with query
   */
  performSearch: (query: string) => {
    const { rootNode } = get();

    if (!rootNode || !query.trim()) {
      set({ searchResults: [], isSearching: false });
      return;
    }

    set({ isSearching: true });

    // Import search utilities dynamically
    import('../../components/tree/utils/searchUtils').then(({ searchTree, DEFAULT_SEARCH_OPTIONS }) => {
      const results = searchTree(rootNode, query, {
        ...DEFAULT_SEARCH_OPTIONS,
        maxResults: 100,
      });

      set({
        searchResults: results,
        isSearching: false,
      });
    }).catch(error => {
      console.error('Failed to perform search:', error);
      set({ isSearching: false });
    });
  },

  /**
   * Clear search results and query
   */
  clearSearch: () => {
    set({
      searchQuery: '',
      searchResults: [],
      isSearching: false,
    });
  },
});