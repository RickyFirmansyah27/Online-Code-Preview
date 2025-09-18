"use client";

import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export function ChatHeader() {
  return (
    <div className="text-center max-w-3xl mx-auto mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-sm text-gray-400 mb-6"
      >
        <BookOpen className="w-4 h-4" />
        AI Chat Interface
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text mb-6"
      >
        Chat with AI Assistant
      </motion.h1>
    </div>
  );
}