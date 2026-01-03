/**
 * Centralized type definitions for the Asset Management module.
 * All shared types and interfaces should be defined here.
 */

// Re-export FileType from FileTypeFilter for convenience
export type { FileType } from "./components/controls/FileTypeFilter";

/**
 * State for the delete confirmation dialog.
 */
export interface DeleteDialogState {
    isOpen: boolean;
    filename: string;
}

/**
 * File operation state returned by useFileOperations hook.
 */
export interface FileOperationsState {
    isUploading: boolean;
    downloadingFiles: Set<string>;
    deletingFiles: Set<string>;
    error: string | null;
}

/**
 * Pagination state for file list.
 */
export interface PaginationState {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    isPageChanging: boolean;
}
