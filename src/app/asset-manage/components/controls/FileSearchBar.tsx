"use client";

import { Search } from "lucide-react";

interface FileSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const FileSearchBar = ({
  searchQuery,
  onSearchChange,
  placeholder = "Search files...",
  className = "",
}: FileSearchBarProps) => {
  return (
    <div className={`relative flex-1 ${className}`}>
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
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#1a1a22] text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search files"
      />
    </div>
  );
};

export default FileSearchBar;