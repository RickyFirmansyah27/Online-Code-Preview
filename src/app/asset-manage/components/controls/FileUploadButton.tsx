"use client";

import { ChangeEvent, useCallback } from "react";
import { Upload } from "lucide-react";

interface FileUploadButtonProps {
  isUploading: boolean;
  onFileUpload: (files: File[]) => void;
  onUploadStart?: () => void;
  className?: string;
  multiple?: boolean;
  acceptedFileTypes?: string;
  disabled?: boolean;
}

const FileUploadButton = ({
  isUploading,
  onFileUpload,
  onUploadStart,
  className = "",
  multiple = true,
  acceptedFileTypes = "*/*",
  disabled = false,
}: FileUploadButtonProps) => {
  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);
      if (!files.length) return;

      if (onUploadStart) {
        onUploadStart();
      }
      
      onFileUpload(files);
      
      // Reset the input value to allow uploading the same file again
      event.target.value = "";
    },
    [onFileUpload, onUploadStart]
  );

  return (
    <label
      className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
        isUploading || disabled
          ? "bg-blue-400 text-white/80 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
      } ${className}`}
      aria-disabled={isUploading || disabled}
    >
      <Upload className="w-5 h-5" aria-hidden="true" />
      <span>{isUploading ? "Uploading..." : "Upload File"}</span>
      <input
        type="file"
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading || disabled}
        multiple={multiple}
        accept={acceptedFileTypes}
        aria-label="Upload file"
      />
    </label>
  );
};

export default FileUploadButton;