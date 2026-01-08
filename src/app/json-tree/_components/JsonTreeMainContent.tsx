"use client";

import JsonSplitView from "./JsonSplitView";
import { JsonFile, JsonNode, JsonValue } from "@/components/types/json.types";
import { FileText, Upload, Plus } from "lucide-react";

interface JsonTreeMainContentProps {
  activeFile: JsonFile | null | undefined;
  jsonFiles: JsonFile[];
  isUploading: boolean;
  onFileSelect: (file: JsonFile) => void;
  onFileSave: (file: JsonFile, content: string) => void;
  onNodeEdit: (node: JsonNode, value: JsonValue) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateNewFile: () => void;
}

export default function JsonTreeMainContent({
  activeFile,
  jsonFiles: _jsonFiles,
  isUploading,
  onFileSelect: _onFileSelect,
  onFileSave,
  onNodeEdit: _onNodeEdit,
  onFileUpload,
  onCreateNewFile,
}: JsonTreeMainContentProps) {
  if (activeFile) {
    return (
      <JsonSplitView
        activeFile={activeFile}
        onSave={onFileSave}
        onFileUpload={onFileUpload}
        onCreate={onCreateNewFile}
      />
    );
  }

  return (
    <div className="bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-12 text-center">
      <FileText className="w-16 h-16 mx-auto mb-6 text-gray-600" />
      <h3 className="text-xl font-semibold text-white mb-2">No JSON File Selected</h3>
      <p className="text-gray-400 mb-6">
        Choose a JSON file from the sidebar or upload a new one to start editing
      </p>
      <div className="flex justify-center gap-4">
        <label className="flex items-center gap-2 px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg cursor-pointer transition-colors">
          <Upload className="w-4 h-4" />
          <span className="font-medium">Upload JSON</span>
          <input
            type="file"
            accept=".json,application/json"
            onChange={onFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>

        <button
          onClick={onCreateNewFile}
          className="flex items-center gap-2 px-6 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Create New</span>
        </button>
      </div>
    </div>
  );
}
