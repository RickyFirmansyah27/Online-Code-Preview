"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { get } from "lodash";
import { BookOpen, Search, Download, Upload, Trash2 } from "lucide-react";
import NavigationHeader from "@/components/NavigationHeader";
import {
  useGetFiles,
  useUploadFiles,
  useDownloadFiles,
  useDeleteFile,
} from "@/service/storage-service";
import type { File } from "@/service/model-types"; // Ensure this type is defined

const FileManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: uploadFile } = useUploadFiles();
  const { mutate: downloadFile } = useDownloadFiles();
  const { mutate: deleteFile } = useDeleteFile();
  const { data: filesResponse, isLoading, refetch } = useGetFiles();

  const filesData = get(filesResponse, "data.data", []);

  const filteredFiles = useMemo(
    () =>
      filesData.filter((file: File) => {
        const matchesSearch = file.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesType = filterType
          ? file.name.toLowerCase().endsWith(`.${filterType.toLowerCase()}`)
          : true;
        return matchesSearch && matchesType;
      }),
    [filesData, searchQuery, filterType]
  );

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      if (!files.length) return;

      try {
        uploadFile(files, {
          onSuccess: () => {
            refetch();
            setIsUploading(false);
          },
        });
      } catch (error) {
        setIsUploading(false);
        console.error("Upload failed:", error);
      }
    },
    [uploadFile, refetch]
  );

    const handleDelete = useCallback(
      async (filename: string) => {
        deleteFile(filename, {
          onSuccess: () => {
            refetch();
          },
        });
      },
      [deleteFile, refetch]
    );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />

      <main className="mx-auto max-w-7xl px-4 py-12">
        <header className="mb-16 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-sm text-gray-400 mb-6"
          >
            <BookOpen className="w-4 h-4" />
            File Management
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text mb-6"
          >
            Discover and Manage Your Files
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 mb-8"
          >
            Explore, share, and manage your files with ease. Find what you need
            quickly and efficiently.
          </motion.p>
        </header>

        {/* Filters and Upload Section */}
        <section className="mb-12 max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <label htmlFor="search-files" className="sr-only">
                Search files
              </label>
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5"
                aria-hidden="true"
              />
              <input
                id="search-files"
                type="text"
                placeholder="Search files..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#1a1a22] text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search files"
              />
            </div>

            {/* File Type Filter */}
            <div
              className="flex gap-2"
              role="group"
              aria-label="File type filters"
            >
              {["All", "pdf", "csv", "xlsx", "docx"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type === "All" ? null : type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === (type === "All" ? null : type)
                      ? "bg-blue-500 text-white"
                      : "bg-[#1a1a22] text-gray-400 hover:bg-gray-700"
                  }`}
                  aria-pressed={filterType === (type === "All" ? null : type)}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Upload Button */}
            <label
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                isUploading
                  ? "bg-blue-400 text-white/80 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              aria-disabled={isUploading}
            >
              <Upload className="w-5 h-5" aria-hidden="true" />
              <span>{isUploading ? "Uploading..." : "Upload File"}</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  handleFileUpload(e);
                  setIsUploading(true);
                }}
                disabled={isUploading}
                multiple
                aria-label="Upload file"
              />
            </label>
          </div>

          {/* File List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              <p className="text-gray-400 col-span-full text-center">
                Loading files...
              </p>
            ) : filteredFiles.length === 0 ? (
              <p className="text-gray-400 col-span-full text-center">
                No files found.
              </p>
            ) : (
              <AnimatePresence>
                {filteredFiles.map((file: File) => (
                  <motion.article
                    key={file.url}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-4 bg-[#1a1a22] rounded-lg border border-gray-700 flex justify-between items-center overflow-hidden"
                    role="listitem"
                    style={{ maxWidth: "100%" }} // Ensure card doesn't exceed parent width
                  >
                    <div className="flex-1 min-w-0 m-1">
                      <h2 className="text-gray-200 font-medium text-sm truncate">
                        {file.name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(file.lastModified).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => downloadFile(file.name)}
                        className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                        aria-label={`Download ${file.name}`}
                      >
                        <Download className="w-5 h-5 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(file.name)}
                        className="p-2 hover:bg-red-700/20 rounded-full transition-colors"
                        aria-label={`Delete ${file.name}`}
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default FileManagement;
