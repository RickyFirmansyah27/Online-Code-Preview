"use client";

import { motion } from "framer-motion";
import { FileText, FolderOpen, MessageSquare, TrendingUp } from "lucide-react";

interface ProfileStatsProps {
  stats: {
    totalSnippets: number;
    totalFiles: number;
    aiInteractions: number;
  };
}

const statItems = [
  {
    key: "totalSnippets",
    label: "Code Snippets",
    icon: FileText,
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-500/10 to-blue-600/10",
  },
  {
    key: "totalFiles",
    label: "Files Uploaded",
    icon: FolderOpen,
    color: "from-green-500 to-green-600",
    bgColor: "from-green-500/10 to-green-600/10",
  },
  {
    key: "aiInteractions",
    label: "AI Interactions",
    icon: MessageSquare,
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-500/10 to-purple-600/10",
  },
];

export default function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        const value = stats[item.key as keyof typeof stats];

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a1a22] to-[#0f0f15] border border-gray-800/50 p-6 group hover:border-gray-700/50 transition-colors"
          >
            {/* Background decoration */}
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${item.bgColor} rounded-full blur-2xl -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform`} />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{item.label}</p>
                <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
              </div>

              <div className={`p-3 rounded-lg bg-gradient-to-br ${item.color} shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Trend indicator */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1 text-green-400 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>+12%</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}