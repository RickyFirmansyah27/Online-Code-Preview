"use client";

import { AnimatePresence } from "framer-motion";
import { ApiFile } from "@/service/model-types";
import FileCard from "./FileCard";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";

interface FileListProps {
  files: ApiFile[];
  isLoading: boolean;
  onDownload: (filename: string) => void;
  onDelete: (filename: string) => void;
  downloadingFiles?: Set<string>;
  deletingFiles?: Set<string>;
  emptyMessage?: string;
  loadingMessage?: string;
  className?: string;
}

const FileList = ({
  files,
  isLoading,
  onDownload,
  onDelete,
  downloadingFiles = new Set(),
  deletingFiles = new Set(),
  emptyMessage = "No files found.",
  loadingMessage = "Loading files...",
  className = "",
}: FileListProps) => {
  if (isLoading) {
    return (
      <div className={`col-span-full flex justify-center items-center py-8 ${className}`}>
        <LoadingSpinner message={loadingMessage} />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className={`col-span-full ${className}`}>
        <EmptyState message={emptyMessage} />
      </div>
    );
  }

  return (
    <AnimatePresence>
      {files.map((file) => (
        <FileCard
          key={file.url}
          file={file}
          onDownload={onDownload}
          onDelete={onDelete}
          isDownloading={downloadingFiles.has(file.name)}
          isDeleting={deletingFiles.has(file.name)}
        />
      ))}
    </AnimatePresence>
  );
};

export default FileList;