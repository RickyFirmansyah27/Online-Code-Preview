"use client";

import { Send, Loader, Image as ImageIcon } from "lucide-react";
import { useRef } from "react";

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
    <form onSubmit={(e) => handleSubmit(e, !!previewImage)} className="max-w-3xl mx-auto">
      {previewImage && (
        <div className="relative mb-3">
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full h-32 object-contain rounded-lg border border-gray-700"
          />
          <button
            type="button"
            onClick={removePreviewImage}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      <div className="relative bg-gray-900/50 rounded-xl p-1 focus-within:ring-2 focus-within:ring-blue-500 mb-5">
        <textarea
          value={input}
          onChange={handleInputChange}
          rows={1}
          className="w-full bg-transparent px-4 py-3 pr-20 text-gray-200 focus:outline-none resize-none overflow-hidden font-mono"
          placeholder="Type your message..."
          disabled={isLoading}
          style={{
            minHeight: "44px",
            maxHeight: "200px",
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
        />
        
        <div className="absolute right-2 bottom-2 flex gap-1">
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
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            title="Upload image"
          >
            <ImageIcon className="w-5 h-5 text-gray-400" />
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 text-gray-400 animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}