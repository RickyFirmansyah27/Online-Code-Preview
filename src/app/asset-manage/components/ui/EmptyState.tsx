"use client";

import { FolderOpen } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  message?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

const EmptyState = ({
  message = "No files found",
  description = "Upload your first file to get started",
  icon,
  className = "",
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center py-16 text-center ${className}`}
    >
      {/* Icon Container */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl" />
        <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#1a1a24] to-[#12121a] ring-1 ring-white/10">
          {icon || <FolderOpen className="w-12 h-12 text-gray-500" />}
        </div>
      </div>

      {/* Message */}
      <h3 className="text-xl font-semibold text-gray-200 mb-2">
        {message}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-gray-500 text-sm max-w-md leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default EmptyState;