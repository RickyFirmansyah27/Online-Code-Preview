"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ITEMS_PER_PAGE, PAGE_CHANGE_DELAY } from "../constants";

interface UsePaginationProps<T> {
    /** Array of items to paginate */
    items: T[];
    /** Number of items per page (defaults to ITEMS_PER_PAGE constant) */
    itemsPerPage?: number;
    /** Dependencies that should reset the page to 1 when changed */
    resetDependencies?: unknown[];
}

interface UsePaginationResult<T> {
    /** Current page number (1-indexed) */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** Items for the current page */
    paginatedItems: T[];
    /** Whether a page change animation is in progress */
    isPageChanging: boolean;
    /** Function to change the current page */
    handlePageChange: (page: number) => void;
}

/**
 * Custom hook for handling pagination logic.
 * Provides memoized pagination state and handlers for page navigation.
 * 
 * @example
 * ```tsx
 * const { paginatedItems, currentPage, totalPages, handlePageChange } = usePagination({
 *   items: files,
 *   resetDependencies: [searchQuery, filterType]
 * });
 * ```
 */
export const usePagination = <T>({
    items,
    itemsPerPage = ITEMS_PER_PAGE,
    resetDependencies = [],
}: UsePaginationProps<T>): UsePaginationResult<T> => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isPageChanging, setIsPageChanging] = useState(false);

    // Calculate total pages
    const totalPages = useMemo(
        () => Math.ceil(items.length / itemsPerPage),
        [items.length, itemsPerPage]
    );

    // Get paginated items for current page
    const paginatedItems = useMemo(
        () => items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
        [items, currentPage, itemsPerPage]
    );

    // Reset page when dependencies change
    useEffect(() => {
        setCurrentPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, resetDependencies);

    // Handle page change with loading state animation
    const handlePageChange = useCallback((page: number) => {
        setIsPageChanging(true);
        setCurrentPage(page);
        setTimeout(() => setIsPageChanging(false), PAGE_CHANGE_DELAY);
    }, []);

    return {
        currentPage,
        totalPages,
        paginatedItems,
        isPageChanging,
        handlePageChange,
    };
};
