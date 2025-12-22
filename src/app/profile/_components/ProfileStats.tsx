"use client";

import { motion } from "framer-motion";
import { FileText, FolderOpen, MessageSquare, TrendingUp, Sparkles } from "lucide-react";

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
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-500/10 to-cyan-500/10",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
    glowColor: "shadow-blue-500/20",
    trend: "+12%",
    trendPositive: true,
  },
  {
    key: "totalFiles",
    label: "Files Uploaded",
    icon: FolderOpen,
    color: "from-emerald-500 to-green-500",
    bgColor: "from-emerald-500/10 to-green-500/10",
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-500",
    glowColor: "shadow-emerald-500/20",
    trend: "+8%",
    trendPositive: true,
  },
  {
    key: "aiInteractions",
    label: "AI Interactions",
    icon: MessageSquare,
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-500/10 to-pink-500/10",
    iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    glowColor: "shadow-purple-500/20",
    trend: "+24%",
    trendPositive: true,
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
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e1e28] via-[#1a1a22] to-[#0f0f15] border border-gray-800/50 p-6 group hover:border-gray-700/80 transition-all duration-300"
          >
            {/* Animated background gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${item.bgColor} rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:scale-150 group-hover:opacity-80 transition-all duration-500 opacity-60`} />

            {/* Sparkle effect on hover */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Sparkles className="w-4 h-4 text-gray-600" />
            </div>

            <div className="relative flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-gray-400 text-sm font-medium tracking-wide">{item.label}</p>
                <motion.p
                  className="text-4xl font-bold text-white"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {value.toLocaleString()}
                </motion.p>
              </div>

              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className={`p-4 rounded-xl ${item.iconBg} shadow-lg ${item.glowColor}`}
              >
                <Icon className="w-6 h-6 text-white" />
              </motion.div>
            </div>

            {/* Enhanced trend indicator */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="absolute bottom-4 right-4 flex items-center gap-1.5"
            >
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${item.trendPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                <TrendingUp className={`w-3 h-3 ${item.trendPositive ? '' : 'rotate-180'}`} />
                <span className="text-xs font-medium">{item.trend}</span>
              </div>
            </motion.div>

            {/* Bottom gradient line */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </motion.div>
        );
      })}
    </div>
  );
}