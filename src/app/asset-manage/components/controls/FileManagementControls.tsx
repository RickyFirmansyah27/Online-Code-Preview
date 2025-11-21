"use client";

import FileSearchBar from "./FileSearchBar";
import FileTypeFilter, { FileType } from "./FileTypeFilter";
import FileUploadButton from "./FileUploadButton";

interface FileManagementControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: FileType | null;
  onFilterChange: (type: FileType | null) => void;
  isUploading: boolean;
  onFileUpload: (files: File[]) => void;
  onUploadStart?: () => void;
  className?: string;
}

const FileManagementControls = ({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  isUploading,
  onFileUpload,
  onUploadStart,
  className = "",
}: FileManagementControlsProps) => {
  return (
    <div className={`space-y-6 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search Bar */}
        <FileSearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          className="flex-1"
        />

        {/* File Type Filter */}
        <FileTypeFilter
          selectedType={filterType}
          onTypeChange={onFilterChange}
        />

        {/* Upload Button */}
        <FileUploadButton
          isUploading={isUploading}
          onFileUpload={onFileUpload}
          onUploadStart={onUploadStart}
        />
      </div>
    </div>
  );
};

export default FileManagementControls;