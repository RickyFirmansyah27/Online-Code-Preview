"use client";

import { motion } from "framer-motion";
import { Database, FileText, Upload, Plus } from "lucide-react";
import { JsonFile } from "@/components/tree/types/json.types";

interface JsonTreeNavbarProps {
    jsonFiles: JsonFile[];
    activeFile: JsonFile | null | undefined;
    onFileSelect: (file: JsonFile) => void;
    isUploading: boolean;
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onCreateNewFile: () => void;
}

export default function JsonTreeNavbar({
    jsonFiles,
    activeFile,
    onFileSelect,
    isUploading,
    onFileUpload,
    onCreateNewFile
}: JsonTreeNavbarProps) {
    return (
        <div className="w-full px-4 mb-4">
            <div className="bg-[#12121a]/90 backdrop-blur border border-white/[0.05] rounded-lg p-3 flex flex-col md:flex-row items-center justify-between gap-4 max-w-[1920px] mx-auto">
                <div className="flex items-center gap-2 shrink-0 border-b md:border-b-0 md:border-r border-white/[0.05] pb-3 md:pb-0 pr-0 md:pr-4 w-full md:w-auto">
                    <Database className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold text-white">JSON Files</span>
                </div>

                <div className="flex-1 overflow-x-auto custom-scrollbar flex items-center gap-2 min-w-0 w-full md:w-auto pb-2 md:pb-0">
                    {jsonFiles.map((file) => (
                        <motion.button
                            key={file.id}
                            onClick={() => onFileSelect(file)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors border whitespace-nowrap ${activeFile?.id === file.id
                                ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                                : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] text-gray-300'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <FileText className="w-3.5 h-3.5" />
                            <span className="text-sm font-medium">{file.name}</span>
                            {file.isDirty && (
                                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full ml-1"></div>
                            )}
                        </motion.button>
                    ))}

                    {jsonFiles.length === 0 && (
                        <span className="text-sm text-gray-500 italic">No files loaded</span>
                    )}
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-3 md:pt-0 pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-white/[0.05] w-full md:w-auto justify-end">
                    <label className="flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg cursor-pointer transition-colors">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm font-medium">Upload</span>
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
                        className="flex items-center justify-center gap-2 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">New</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
