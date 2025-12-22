"use client";

import { useMemo } from "react";
import { ApiFile } from "@/service/model-types";
import { FileType } from "../components/controls/FileTypeFilter";

interface UseFileFilteringProps {
  files: ApiFile[];
  searchQuery: string;
  filterType: FileType | null;
}

export const useFileFiltering = ({
  files,
  searchQuery,
  filterType,
}: UseFileFilteringProps) => {
  const filteredFiles = useMemo(
    () =>
      files.filter((file) => {
        // Filter out files without extensions
        const hasExtension = file.name.includes('.') &&
          file.name.lastIndexOf('.') < file.name.length - 1 &&
          file.name.lastIndexOf('.') > 0;

        if (!hasExtension) return false;

        const matchesSearch = file.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        const matchesType = filterType
          ? file.name.toLowerCase().endsWith(`.${filterType.toLowerCase()}`)
          : true;

        return matchesSearch && matchesType;
      }),
    [files, searchQuery, filterType]
  );

  const fileStats = useMemo(() => {
    const stats = {
      total: files.length,
      filtered: filteredFiles.length,
      byType: {} as Record<string, number>,
    };

    files.forEach((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown';
      stats.byType[extension] = (stats.byType[extension] || 0) + 1;
    });

    return stats;
  }, [files, filteredFiles]);

  return {
    filteredFiles,
    fileStats,
  };
};