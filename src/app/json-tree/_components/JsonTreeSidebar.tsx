"use client";

import { motion } from "framer-motion";
import { Database, FileText, Upload, Plus } from "lucide-react";
import { JsonFile } from "@/components/tree/types/json.types";

interface JsonTreeSidebarProps {
  jsonFiles: JsonFile[];
  activeFile: JsonFile | null | undefined;
  onFileSelect: (file: JsonFile) => void;
  isUploading: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateNewFile: () => void;
}

export default function JsonTreeSidebar({
  jsonFiles,
  activeFile,
  onFileSelect,
  isUploading,
  onFileUpload,
  onCreateNewFile
}: JsonTreeSidebarProps) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-400" />
          JSON Files
        </h3>

        <div className="space-y-2 mb-6">
          {jsonFiles.map((file) => (
            <motion.button
              key={file.id}
              onClick={() => onFileSelect(file)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${activeFile?.id === file.id
                ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                : 'hover:bg-white/[0.05] text-gray-300'
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium truncate">{file.name}</span>
                </div>
                {file.isDirty && (
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {file.type} • {(file.size / 1024).toFixed(1)} KB
              </div>
            </motion.button>
          ))}
        </div>

        {jsonFiles.length === 0 && (
          <div className="text-center py-8 text-gray-400 mb-6">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No JSON files found</p>
            <p className="text-xs mt-1">Upload or create a new JSON file to get started</p>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-4 border-t border-white/[0.05]">
          <label className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Upload JSON</span>
            <input
              type="file"
              multiple
              accept=".json,application/json"
              onChange={onFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>

          <button
            onClick={onCreateNewFile}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New File</span>
          </button>
        </div>
      </div>
    </div>
  );
}
