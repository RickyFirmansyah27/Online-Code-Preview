"use client";

import { Upload, Plus } from "lucide-react";
import AI from "@/app/(root)/_components/AI";
import FileManage from "@/app/(root)/_components/FileManage";
import Logo from "@/app/(root)/_components/Logo";

interface JsonTreePageHeaderProps {
  isUploading: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateNewFile: () => void;
}

export default function JsonTreePageHeader({
  isUploading,
  onFileUpload,
  onCreateNewFile,
}: JsonTreePageHeaderProps) {
  return (
    <div className="border-b border-gray-800 bg-[#0a0a0f]/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <Logo />
            <div>
              <nav className="flex flex-wrap justify-center sm:justify-start gap-2 w-full sm:w-auto">
                <FileManage />
                <AI />
              </nav>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg cursor-pointer transition-colors">
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
              className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">New File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
