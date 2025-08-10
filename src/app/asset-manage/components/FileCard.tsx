"use client";

import { motion } from "framer-motion";
import { Download, Trash2 } from "lucide-react";
import { ApiFile } from "@/service/model-types";

interface FileCardProps {
  file: ApiFile;
  onDownload: (filename: string) => void;
  onDelete: (filename: string) => void;
  isDownloading?: boolean;
  isDeleting?: boolean;
  className?: string;
}

const FileCard = ({
  file,
  onDownload,
  onDelete,
  isDownloading = false,
  isDeleting = false,
  className = "",
}: FileCardProps) => {
  const getFileIcon = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "csv":
        return "📊";
      case "xlsx":
        return "📈";
      case "docx":
        return "📝";
      default:
        return "📄";
    }
  };

  return (
    <motion.article
      key={file.url}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 bg-[#1a1a22] rounded-lg border border-gray-700 flex justify-between items-center overflow-hidden ${className}`}
      role="listitem"
      style={{ maxWidth: "100%" }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-2xl" aria-hidden="true">
          {getFileIcon(file.name)}
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="text-gray-200 font-medium text-sm truncate">
            {file.name}
          </h2>
          <div className="flex gap-2 text-sm text-gray-500 mt-1">
            <span>{new Date(file.lastModified).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 shrink-0 ml-2">
        <button
          onClick={() => onDownload(file.name)}
          disabled={isDownloading || isDeleting}
          className={`p-2 rounded-full transition-colors ${
            isDownloading || isDeleting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-700"
          }`}
          aria-label={`Download ${file.name}`}
          title={`Download ${file.name}`}
        >
          <Download className="w-5 h-5 text-gray-400" />
        </button>
        <button
          onClick={() => onDelete(file.name)}
          disabled={isDownloading || isDeleting}
          className={`p-2 rounded-full transition-colors ${
            isDownloading || isDeleting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-red-700/20"
          }`}
          aria-label={`Delete ${file.name}`}
          title={`Delete ${file.name}`}
        >
          <Trash2 className="w-5 h-5 text-red-400" />
        </button>
      </div>
    </motion.article>
  );
};

export default FileCard;