"use client";

import NavigationHeader from "@/components/NavigationHeader";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Search, Download, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useGetFiles, useUploadFiles } from "@/service/storage-service";
import { File } from "@/service/model-types";

function FileManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const { mutate: uploadFile } = useUploadFiles();

  const [isUploading, setIsUploading] = useState(false);

  // fetch files from the server
  const { data: filesResponse, refetch } = useGetFiles();
  const filesData = filesResponse?.data?.data ?? [];


  // Handle file upload
  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      uploadFile([file]); // Upload the file
      refetch(); // Refresh the file list after upload
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  }

  const filteredFiles = filesData.filter((file: File) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType
      ? file.name.toLowerCase().endsWith(`.${filterType.toLowerCase()}`)
      : true;
    return matchesSearch && matchesType;
  });
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r
             from-blue-500/10 to-purple-500/10 text-sm text-gray-400 mb-6"
          >
            <BookOpen className="w-4 h-4" />
            Files Management
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text mb-6"
          >
            Discover and Manage your files
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 mb-8"
          >
            Explore, share, and manage your files with ease. Find what you need quickly and efficiently.
          </motion.p>
        </div>

        {/* Filters and Upload Section */}
        <div className="relative max-w-5xl mx-auto mb-12 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search files..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#1a1a22] text-gray-200 border border-gray-700 focus:outline-none focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* File Type Filter */}
            <div className="flex gap-2">
              {["All", "pdf", "csv", "xlsx", "docx"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type === "All" ? null : type)}
                  className={`px-4 py-2 rounded-lg ${
                    filterType === (type === "All" ? null : type)
                      ? "bg-blue-500 text-white"
                      : "bg-[#1a1a22] text-gray-400"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Upload Button */}
            <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
              <Upload className="w-5 h-5" />
              <span>{isUploading ? "Uploading..." : "Upload File"}</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </div>

          {/* File List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredFiles.map((file: File) => (
                <motion.div
                  key={file.url}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 bg-[#1a1a22] rounded-lg border border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-200 font-medium">{file.name}</p>
                      <p className="text-sm text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(file.lastModified).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      href={file.url}
                      download
                      className="p-2 hover:bg-gray-700 rounded-full"
                    >
                      <Download className="w-5 h-5 text-gray-400" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileManagement;
