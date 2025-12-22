"use client";

import { motion } from "framer-motion";
import { FileText, MessageSquare, Upload, Code, Calendar, ChevronRight, Loader2 } from "lucide-react";

// Mock activity data - in a real app, this would come from your backend
const mockActivities = [
  {
    id: 1,
    type: "code_execution",
    title: "Executed Python code",
    description: "Successfully ran a data analysis script",
    timestamp: "2 hours ago",
    icon: Code,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    id: 2,
    type: "file_upload",
    title: "Uploaded file",
    description: "Added 'report.pdf' to asset management",
    timestamp: "1 day ago",
    icon: Upload,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  {
    id: 3,
    type: "ai_interaction",
    title: "AI Chat Session",
    description: "Had a conversation about React best practices",
    timestamp: "2 days ago",
    icon: MessageSquare,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    id: 4,
    type: "snippet_created",
    title: "Created code snippet",
    description: "Shared a useful JavaScript utility function",
    timestamp: "3 days ago",
    icon: FileText,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  {
    id: 5,
    type: "code_execution",
    title: "Executed Java code",
    description: "Compiled and ran a Spring Boot application",
    timestamp: "1 week ago",
    icon: Code,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
];

export default function ProfileActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-[#1e1e28] via-[#1a1a22] to-[#0f0f15] rounded-2xl border border-gray-800/50 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-800/50 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20"
          >
            <Calendar className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
            <p className="text-gray-400 text-sm">Your latest actions and interactions</p>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="p-6">
        <div className="space-y-3">
          {mockActivities.map((activity, index) => {
            const Icon = activity.icon;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className={`flex items-start gap-4 p-4 rounded-xl bg-[#0f0f15]/50 hover:bg-[#0f0f15] border ${activity.borderColor} hover:border-gray-700/50 transition-all duration-300 cursor-pointer group`}
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`p-2.5 rounded-lg ${activity.bgColor} flex-shrink-0 ring-1 ring-inset ${activity.borderColor}`}
                >
                  <Icon className={`w-4 h-4 ${activity.color}`} />
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-gray-200 font-medium text-sm group-hover:text-white transition-colors">
                        {activity.title}
                      </h4>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-1 group-hover:text-gray-400 transition-colors">
                        {activity.description}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-gray-600 text-xs mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                    {activity.timestamp}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-6 py-3 bg-[#0f0f15] hover:bg-[#151520] text-gray-300 hover:text-white rounded-xl transition-all duration-300 border border-gray-700/50 hover:border-gray-600 font-medium text-sm inline-flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 group-hover:animate-spin" />
            Load More Activity
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}