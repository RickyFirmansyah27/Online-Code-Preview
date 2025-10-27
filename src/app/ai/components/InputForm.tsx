"use client";

import { Send, Loader, Image as ImageIcon } from "lucide-react";
import { useRef, useEffect } from "react";

interface InputFormProps {
  input: string;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent, hasImage: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onImageUpload?: (imageData: string | null) => void;
  previewImage: string | null;
}

export function InputForm({
  input,
  isLoading,
  handleSubmit,
  handleInputChange,
  onImageUpload,
  previewImage
}: InputFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current && input === "") {
      textareaRef.current.style.height = "32px"; // Reset to initial height
    }
  }, [input]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        if (onImageUpload) {
          onImageUpload(imageData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removePreviewImage = () => {
    if (onImageUpload) {
      onImageUpload(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, !!previewImage)}>
      {previewImage && (
        <div className="mb-3 sm:mb-4">
          <div className="relative inline-block max-w-full">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full h-32 sm:h-40 object-contain rounded-lg border border-gray-700"
            />
            <button
              type="button"
              onClick={removePreviewImage}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="relative bg-gray-900/80 rounded-xl sm:rounded-2xl p-2.5 sm:p-3 focus-within:ring-2 focus-within:ring-blue-500/50 border border-gray-700/60 backdrop-blur-sm">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          className="w-full bg-transparent px-3 sm:px-4 py-2.5 sm:py-3 pr-20 sm:pr-24 text-gray-100 focus:outline-none resize-none font-sans custom-scrollbar text-sm sm:text-base placeholder:text-gray-400"
          placeholder="Message AI Assistant..."
          disabled={isLoading}
          style={{
            minHeight: "32px",
            maxHeight: "120px",
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
        />

        <div className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 flex gap-1.5 sm:gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={triggerFileInput}
            disabled={isLoading}
            className="p-2 sm:p-2.5 hover:bg-gray-700/70 rounded-lg transition-all duration-200 disabled:opacity-50"
            title="Upload image"
          >
            <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-300" />
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="p-2 sm:p-2.5 hover:bg-blue-600/20 rounded-lg transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 animate-spin" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-blue-400" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}