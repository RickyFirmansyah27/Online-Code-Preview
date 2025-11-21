"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

interface FileManagementHeaderProps {
  title?: string;
  description?: string;
}

const FileManagementHeader = ({
  title = "Discover and Manage Your Files",
  description = "Explore, share, and manage your files with ease. Find what you need quickly and efficiently.",
}: FileManagementHeaderProps) => {
  return (
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
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg text-gray-400 mb-8"
      >
        {description}
      </motion.p>
    </header>
  );
};

export default FileManagementHeader;