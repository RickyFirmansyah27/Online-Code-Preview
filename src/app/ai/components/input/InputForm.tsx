"use client";

import React from "react";
import { Send, Loader, Image as ImageIcon, Sparkles } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface InputFormProps {
  input: string;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent, hasImage: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onImageUpload: (imageData: string[]) => void;
  previewImages: string[];
}

export const InputForm = React.memo(function InputForm({
  input,
  isLoading,
  handleSubmit,
  handleInputChange,
  onImageUpload,
  previewImages
}: InputFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (textareaRef.current && input === "") {
      textareaRef.current.style.height = "32px";
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
      {/* Outer glow wrapper */}
      <motion.div
        animate={{
          boxShadow: isFocused
            ? "0 0 30px rgba(59, 130, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.15)"
            : "0 0 20px rgba(59, 130, 246, 0.1)"
        }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl"
      >
        {/* Animated gradient border */}
        <div
          className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-cyan-500/50 transition-opacity duration-300 ${isFocused ? "opacity-100" : "opacity-40"
            }`}
          style={{
            background: isFocused
              ? "linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(139, 92, 246, 0.6), rgba(6, 182, 212, 0.6))"
              : "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.3))"
          }}
        />

        {/* Main container */}
        <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-900/98 to-gray-800/95 rounded-2xl p-4 backdrop-blur-xl">
          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

          {/* Sparkle indicator when focused */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute top-3 left-4"
              >
                <Sparkles className="w-4 h-4 text-blue-400/60" />
              </motion.div>
            )}
          </AnimatePresence>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="relative w-full bg-transparent px-4 py-4 pr-28 text-gray-100 focus:outline-none resize-none font-sans custom-scrollbar text-base placeholder:text-gray-500 placeholder:transition-colors placeholder:duration-300 focus:placeholder:text-gray-400"
            placeholder="Ask anything or describe what you want to build..."
            disabled={isLoading}
            style={{
              minHeight: "52px",
              maxHeight: "150px"
            }}
            onInput={e => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
          />

          {/* Action buttons */}
          <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
              disabled={isLoading}
              multiple
            />

            {/* Image upload button */}
            <motion.button
              type="button"
              onClick={triggerFileInput}
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-xl transition-all duration-200 disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center group overflow-hidden"
              title="Upload image (max 2)"
            >
              {/* Button background */}
              <div className="absolute inset-0 bg-gray-700/40 group-hover:bg-gray-600/50 transition-colors duration-200 rounded-xl" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-purple-500/20 to-pink-500/20 transition-opacity duration-200 rounded-xl" />
              <ImageIcon className="relative w-5 h-5 text-gray-400 group-hover:text-purple-300 transition-colors duration-200" />
            </motion.button>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isLoading || (!input.trim() && previewImages.length === 0)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center group overflow-hidden"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-80 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-xl" />

              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </div>

              {isLoading ? (
                <Loader className="relative w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="relative w-5 h-5 text-white transform group-hover:-rotate-12 transition-transform duration-200" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </form>
  );
});