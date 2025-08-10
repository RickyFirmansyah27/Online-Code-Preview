"use client";

import { ButtonHTMLAttributes } from "react";

export type FileType = "All" | "pdf" | "csv" | "xlsx" | "docx";

interface FileTypeFilterProps {
  selectedType: FileType | null;
  onTypeChange: (type: FileType | null) => void;
  fileTypes?: FileType[];
  className?: string;
}

const FileTypeFilter = ({
  selectedType,
  onTypeChange,
  fileTypes = ["All", "pdf", "csv", "xlsx", "docx"],
  className = "",
}: FileTypeFilterProps) => {
  return (
    <div
      className={`flex gap-2 ${className}`}
      role="group"
      aria-label="File type filters"
    >
      {fileTypes.map((type) => (
        <FilterButton
          key={type}
          type={type}
          isSelected={selectedType === (type === "All" ? null : type)}
          onClick={() => onTypeChange(type === "All" ? null : type)}
        />
      ))}
    </div>
  );
};

interface FilterButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type: FileType;
  isSelected: boolean;
}

const FilterButton = ({ type, isSelected, onClick }: FilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isSelected
          ? "bg-blue-500 text-white"
          : "bg-[#1a1a22] text-gray-400 hover:bg-gray-700"
      }`}
      aria-pressed={isSelected}
    >
      {type}
    </button>
  );
};

export default FileTypeFilter;