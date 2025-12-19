"use client";

import { X } from "lucide-react";

interface NewFileDialogProps {
  show: boolean;
  onClose: () => void;
  fileName: string;
  onFileNameChange: (name: string) => void;
  fileContent: string;
  onFileContentChange: (content: string) => void;
  onCreate: () => void;
}

export default function NewFileDialog({
  show,
  onClose,
  fileName,
  onFileNameChange,
  fileContent,
  onFileContentChange,
  onCreate,
}: NewFileDialogProps) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#12121a] rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Create New JSON File</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              File Name
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => onFileNameChange(e.target.value)}
              placeholder="Enter file name (e.g., data.json)"
              className="w-full bg-[#1e1e2e] text-gray-200 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              JSON Content
            </label>
            <textarea
              value={fileContent}
              onChange={(e) => onFileContentChange(e.target.value)}
              placeholder="Enter your JSON content here..."
              rows={12}
              className="w-full bg-[#1e1e2e] text-gray-200 border border-gray-600 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onCreate}
            disabled={!fileName.trim() || !fileContent.trim()}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Create File
          </button>
        </div>
      </div>
    </div>
  );
}
