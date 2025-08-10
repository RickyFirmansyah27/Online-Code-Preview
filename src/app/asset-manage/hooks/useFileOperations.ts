"use client";

import { useCallback, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useUploadFiles, useDownloadFiles, useDeleteFile } from "@/service/storage-service";
import toast from "react-hot-toast";

interface UseFileOperationsProps {
  onSuccess?: () => void;
}

export const useFileOperations = ({ onSuccess }: UseFileOperationsProps = {}) => {
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const userParam = { firstName: user?.firstName || undefined };

  const { mutate: uploadFile } = useUploadFiles(userParam);
  const { mutate: downloadFile } = useDownloadFiles(userParam);
  const { mutate: deleteFile } = useDeleteFile(userParam);

  const handleFileUpload = useCallback(
    async (files: File[]) => {
      if (!files.length) return;

      setIsUploading(true);
      setError(null);

      try {
        uploadFile(files, {
          onSuccess: () => {
            setIsUploading(false);
            toast.success("Files uploaded successfully!");
            onSuccess?.();
          },
          onError: (error) => {
            setIsUploading(false);
            const errorMessage = error instanceof Error ? error.message : "Upload failed";
            setError(errorMessage);
            toast.error(errorMessage);
          },
        });
      } catch (error) {
        setIsUploading(false);
        const errorMessage = error instanceof Error ? error.message : "Upload failed";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
    [uploadFile, onSuccess]
  );

  const handleDownload = useCallback(
    async (filename: string) => {
      if (downloadingFiles.has(filename)) return;

      setDownloadingFiles(prev => new Set(prev).add(filename));
      setError(null);

      try {
        downloadFile(filename, {
          onSuccess: () => {
            setDownloadingFiles(prev => {
              const newSet = new Set(prev);
              newSet.delete(filename);
              return newSet;
            });
            toast.success("File downloaded successfully!");
          },
          onError: (error) => {
            setDownloadingFiles(prev => {
              const newSet = new Set(prev);
              newSet.delete(filename);
              return newSet;
            });
            const errorMessage = error instanceof Error ? error.message : "Download failed";
            setError(errorMessage);
            toast.error(errorMessage);
          },
        });
      } catch (error) {
        setDownloadingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(filename);
          return newSet;
        });
        const errorMessage = error instanceof Error ? error.message : "Download failed";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
    [downloadFile, downloadingFiles]
  );

  const handleDelete = useCallback(
    async (filename: string) => {
      if (deletingFiles.has(filename)) return;

      setDeletingFiles(prev => new Set(prev).add(filename));
      setError(null);

      try {
        deleteFile(filename, {
          onSuccess: () => {
            setDeletingFiles(prev => {
              const newSet = new Set(prev);
              newSet.delete(filename);
              return newSet;
            });
            toast.success("File deleted successfully!");
            onSuccess?.();
          },
          onError: (error) => {
            setDeletingFiles(prev => {
              const newSet = new Set(prev);
              newSet.delete(filename);
              return newSet;
            });
            const errorMessage = error instanceof Error ? error.message : "Delete failed";
            setError(errorMessage);
            toast.error(errorMessage);
          },
        });
      } catch (error) {
        setDeletingFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(filename);
          return newSet;
        });
        const errorMessage = error instanceof Error ? error.message : "Delete failed";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    },
    [deleteFile, deletingFiles, onSuccess]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isUploading,
    downloadingFiles,
    deletingFiles,
    error,
    handleFileUpload,
    handleDownload,
    handleDelete,
    clearError,
  };
};