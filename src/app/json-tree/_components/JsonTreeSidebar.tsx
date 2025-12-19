"use client";

import { motion } from "framer-motion";
import { Database, FileText, Settings } from "lucide-react";
import { JsonFile } from "@/components/tree/types/json.types";

interface JsonTreeSidebarProps {
  jsonFiles: JsonFile[];
  activeFile: JsonFile | null | undefined;
  onFileSelect: (file: JsonFile) => void;
}

const FeatureItem = ({ color, name }: { color: string; name: string }) => (
  <div className="flex items-center gap-2 text-sm text-gray-300">
    <div className={`w-2 h-2 ${color} rounded-full`}></div>
    {name}
  </div>
);


export default function JsonTreeSidebar({ jsonFiles, activeFile, onFileSelect }: JsonTreeSidebarProps) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-400" />
          JSON Files
        </h3>

        <div className="space-y-2">
          {jsonFiles.map((file) => (
            <motion.button
              key={file.id}
              onClick={() => onFileSelect(file)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                activeFile?.id === file.id
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
          <div className="text-center py-8 text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No JSON files found</p>
            <p className="text-xs mt-1">Upload or create a new JSON file to get started</p>
          </div>
        )}
      </div>

      <div className="bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6 mt-6">
        <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-purple-400" />
          Features
        </h4>

        <div className="space-y-3">
            <FeatureItem color="bg-green-400" name="Tree Navigation" />
            <FeatureItem color="bg-blue-400" name="Real-time Search" />
            <FeatureItem color="bg-purple-400" name="Inline Editing" />
            <FeatureItem color="bg-yellow-400" name="Validation" />
            <FeatureItem color="bg-red-400" name="Export Options" />
        </div>
      </div>
    </div>
  );
}
