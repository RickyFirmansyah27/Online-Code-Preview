"use client";

import { useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { get } from "lodash";
import Header from "../(root)/_components/Header";
import { useGetFiles } from "@/service/storage-service";
import FileManagementHeader from "./components/layout/FileManagementHeader";
import FileManagementControls from "./components/controls/FileManagementControls";
import FileList from "./components/file/FileList";
import Pagination from "./components/layout/Pagination";
import ConfirmationDialog from "./components/ui/ConfirmationDialog";
import ErrorNotification from "./components/ui/ErrorNotification";
import { useFileOperations } from "./hooks/useFileOperations";
import { useFileFiltering } from "./hooks/useFileFiltering";
import { usePagination } from "./hooks/usePagination";
import { DeleteDialogState, FileType } from "./types";
import { ApiFile } from "@/service/model-types";

const FileManagement = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FileType | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    isOpen: false,
    filename: "",
  });
  const { user } = useUser();

  // Data fetching
  const { data: filesResponse, isLoading, refetch } = useGetFiles(
    { firstName: user?.firstName ?? "Other" },
    { enabled: user === null || !!user?.firstName }
  );
  const filesData: ApiFile[] = get(filesResponse, "data.files", []);

  // File operations
  const {
    isUploading,
    downloadingFiles,
    deletingFiles,
    error,
    handleFileUpload,
    handleDownload,
    handleDelete,
    clearError,
  } = useFileOperations({
    onSuccess: () => refetch(),
  });

  // File filtering
  const { filteredFiles } = useFileFiltering({
    files: filesData,
    searchQuery,
    filterType,
  });

  // Pagination (using custom hook)
  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedFiles,
    isPageChanging,
    handlePageChange,
  } = usePagination({
    items: filteredFiles,
    resetDependencies: [searchQuery, filterType],
  });

  // Event handlers
  const handleUploadStart = useCallback(() => {
    // Additional upload start logic if needed
  }, []);

  const handleDeleteClick = useCallback((filename: string) => {
    setDeleteDialog({ isOpen: true, filename });
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteDialog.filename) {
      handleDelete(deleteDialog.filename);
      setDeleteDialog({ isOpen: false, filename: "" });
    }
  }, [deleteDialog.filename, handleDelete]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialog({ isOpen: false, filename: "" });
  }, []);

  // Clear error when component unmounts or when user interacts
  const handleInteraction = useCallback(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] overflow-x-hidden"
      onClick={handleInteraction}
      onKeyDown={handleInteraction}
    >
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Header Section */}
        <FileManagementHeader />

        {/* Controls Section */}
        <section className="mb-12 max-w-5xl mx-auto">
          <FileManagementControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterType={filterType}
            onFilterChange={setFilterType}
            isUploading={isUploading}
            onFileUpload={handleFileUpload}
            onUploadStart={handleUploadStart}
          />
        </section>

        {/* File List Section */}
        <section className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <FileList
              files={paginatedFiles}
              isLoading={isLoading}
              onDownload={handleDownload}
              onDelete={handleDeleteClick}
              downloadingFiles={downloadingFiles}
              deletingFiles={deletingFiles}
              emptyMessage={
                searchQuery || filterType
                  ? "No files match your search criteria."
                  : "No files found."
              }
              isPageChanging={isPageChanging}
            />
          </div>
        </section>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={deleteDialog.isOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete File"
          description={`Are you sure you want to delete "${deleteDialog.filename}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          isDestructive={true}
          isLoading={deletingFiles.has(deleteDialog.filename)}
        />

        {/* Error Notification */}
        <ErrorNotification error={error} />
      </main>
    </div>
  );
};

export default FileManagement;
