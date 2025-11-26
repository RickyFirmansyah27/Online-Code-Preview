"use client";

import { Send, Loader, Image as ImageIcon } from "lucide-react";
import { useRef, useEffect } from "react";

interface InputFormProps {
  input: string;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent, hasImage: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onImageUpload: (imageData: string[]) => void;
  previewImages: string[];
}

export function InputForm({
  input,
  isLoading,
  handleSubmit,
  handleInputChange,
  onImageUpload,
  previewImages
}: InputFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current && input === "") {
      textareaRef.current.style.height = "32px"; // Reset to initial height
    }
  }, [input]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (files.length > 2) {
        alert("You can only upload a maximum of 2 images.");
        return;
      }
      const imagePromises = Array.from(files).map(file => {
        return new Promise<string>((resolve, reject) => {
          if (!file.type.startsWith("image/")) {
            alert("Please select image files only.");
            reject("Invalid file type");
            return;
          }
          const reader = new FileReader();
          reader.onload = event => {
            resolve(event.target?.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises)
        .then(images => {
          onImageUpload(images);
        })
        .catch(error => {
          console.error("Error reading files:", error);
        });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={e => handleSubmit(e, previewImages.length > 0)}>
      <div className="relative bg-gray-900/80 rounded-2xl p-4 focus-within:ring-2 focus-within:ring-blue-500/50 border border-gray-700/60 backdrop-blur-sm">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          className="w-full bg-transparent px-4 py-4 pr-20 text-gray-100 focus:outline-none resize-none font-sans custom-scrollbar text-base placeholder:text-gray-400"
          placeholder="Message AI Assistant..."
          disabled={isLoading}
          style={{
            minHeight: "52px",
            maxHeight: "120px"
          }}
          onInput={e => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
        />

        <div className="absolute right-3 bottom-3 flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
            disabled={isLoading}
            multiple
          />

          <button
            type="button"
            onClick={triggerFileInput}
            disabled={isLoading}
            className="p-3 hover:bg-gray-700/70 rounded-xl transition-all duration-200 disabled:opacity-50 min-h-[48px] min-w-[48px] flex items-center justify-center"
            title="Upload image"
          >
            <ImageIcon className="w-5 h-5 text-gray-400 hover:text-gray-300" />
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="p-3 hover:bg-blue-600/20 rounded-xl transition-all duration-200 disabled:opacity-50 min-h-[48px] min-w-[48px] flex items-center justify-center"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 text-gray-400 animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-gray-400 hover:text-blue-400" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}