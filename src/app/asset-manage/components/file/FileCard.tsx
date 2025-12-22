"use client";

import { motion } from "framer-motion";
import { Download, Trash2, FileText, FileSpreadsheet, FileImage, FileVideo, FileCode, File, FileArchive, FileAudio } from "lucide-react";
import { ApiFile } from "@/service/model-types";

interface FileCardProps {
  file: ApiFile;
  onDownload: (filename: string) => void;
  onDelete: (filename: string) => void;
  isDownloading?: boolean;
  isDeleting?: boolean;
  className?: string;
}

// File extension to icon and color mapping
const FILE_TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  // Documents
  pdf: { icon: FileText, color: "text-red-400", bgColor: "bg-red-500/10" },
  doc: { icon: FileText, color: "text-blue-400", bgColor: "bg-blue-500/10" },
  docx: { icon: FileText, color: "text-blue-400", bgColor: "bg-blue-500/10" },
  txt: { icon: FileText, color: "text-gray-400", bgColor: "bg-gray-500/10" },

  // Spreadsheets
  csv: { icon: FileSpreadsheet, color: "text-green-400", bgColor: "bg-green-500/10" },
  xlsx: { icon: FileSpreadsheet, color: "text-green-400", bgColor: "bg-green-500/10" },
  xls: { icon: FileSpreadsheet, color: "text-green-400", bgColor: "bg-green-500/10" },

  // Images
  png: { icon: FileImage, color: "text-purple-400", bgColor: "bg-purple-500/10" },
  jpg: { icon: FileImage, color: "text-purple-400", bgColor: "bg-purple-500/10" },
  jpeg: { icon: FileImage, color: "text-purple-400", bgColor: "bg-purple-500/10" },
  gif: { icon: FileImage, color: "text-purple-400", bgColor: "bg-purple-500/10" },
  svg: { icon: FileImage, color: "text-purple-400", bgColor: "bg-purple-500/10" },
  webp: { icon: FileImage, color: "text-purple-400", bgColor: "bg-purple-500/10" },

  // Videos
  mp4: { icon: FileVideo, color: "text-pink-400", bgColor: "bg-pink-500/10" },
  mov: { icon: FileVideo, color: "text-pink-400", bgColor: "bg-pink-500/10" },
  avi: { icon: FileVideo, color: "text-pink-400", bgColor: "bg-pink-500/10" },
  mkv: { icon: FileVideo, color: "text-pink-400", bgColor: "bg-pink-500/10" },

  // Audio
  mp3: { icon: FileAudio, color: "text-orange-400", bgColor: "bg-orange-500/10" },
  wav: { icon: FileAudio, color: "text-orange-400", bgColor: "bg-orange-500/10" },

  // Code
  js: { icon: FileCode, color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
  ts: { icon: FileCode, color: "text-blue-400", bgColor: "bg-blue-500/10" },
  jsx: { icon: FileCode, color: "text-cyan-400", bgColor: "bg-cyan-500/10" },
  tsx: { icon: FileCode, color: "text-cyan-400", bgColor: "bg-cyan-500/10" },
  py: { icon: FileCode, color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
  json: { icon: FileCode, color: "text-amber-400", bgColor: "bg-amber-500/10" },
  html: { icon: FileCode, color: "text-orange-400", bgColor: "bg-orange-500/10" },
  css: { icon: FileCode, color: "text-blue-400", bgColor: "bg-blue-500/10" },

  // Archives
  zip: { icon: FileArchive, color: "text-amber-400", bgColor: "bg-amber-500/10" },
  rar: { icon: FileArchive, color: "text-amber-400", bgColor: "bg-amber-500/10" },
  "7z": { icon: FileArchive, color: "text-amber-400", bgColor: "bg-amber-500/10" },
  tar: { icon: FileArchive, color: "text-amber-400", bgColor: "bg-amber-500/10" },
};

const DEFAULT_CONFIG = { icon: File, color: "text-gray-400", bgColor: "bg-gray-500/10" };

const getFileConfig = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase() || "";
  return FILE_TYPE_CONFIG[extension] || DEFAULT_CONFIG;
};

const getExtension = (filename: string) => {
  return filename.split(".").pop()?.toUpperCase() || "";
};

const FileCard = ({
  file,
  onDownload,
  onDelete,
  isDownloading = false,
  isDeleting = false,
  className = "",
}: FileCardProps) => {
  const config = getFileConfig(file.name);
  const Icon = config.icon;
  const extension = getExtension(file.name);

  return (
    <motion.article
      key={file.url}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className={`group relative p-5 bg-gradient-to-br from-[#1a1a24] to-[#12121a] rounded-xl border border-gray-800/50 hover:border-gray-700/80 shadow-lg hover:shadow-xl hover:shadow-black/20 transition-all duration-300 ${className}`}
      role="listitem"
      style={{ maxWidth: "100%" }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-start gap-4">
        {/* File Icon */}
        <div className={`flex-shrink-0 p-3 rounded-xl ${config.bgColor} ring-1 ring-white/5`}>
          <Icon className={`w-6 h-6 ${config.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          {/* File Name */}
          <h2 className="text-gray-100 font-medium text-sm truncate mb-2 group-hover:text-white transition-colors">
            {file.name}
          </h2>

          {/* Meta info */}
          <div className="flex items-center gap-3">
            {/* Extension Badge */}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${config.bgColor} ${config.color} ring-1 ring-white/10`}>
              {extension}
            </span>

            {/* Date */}
            <span className="text-xs text-gray-500">
              {new Date(file.lastModified).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative flex gap-2 mt-4 pt-4 border-t border-gray-800/50">
        <button
          onClick={() => onDownload(file.name)}
          disabled={isDownloading || isDeleting}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isDownloading || isDeleting
              ? "opacity-50 cursor-not-allowed bg-gray-800/50 text-gray-500"
              : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 ring-1 ring-blue-500/20 hover:ring-blue-500/40"
            }`}
          aria-label={`Download ${file.name}`}
          title={`Download ${file.name}`}
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>

        <button
          onClick={() => onDelete(file.name)}
          disabled={isDownloading || isDeleting}
          className={`p-2 rounded-lg transition-all duration-200 ${isDownloading || isDeleting
              ? "opacity-50 cursor-not-allowed bg-gray-800/50 text-gray-500"
              : "bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 ring-1 ring-red-500/20 hover:ring-red-500/40"
            }`}
          aria-label={`Delete ${file.name}`}
          title={`Delete ${file.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.article>
  );
};

export default FileCard;