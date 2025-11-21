"use client";

import { motion } from "framer-motion";
import { FileText, MessageSquare, Upload, Code, Calendar } from "lucide-react";


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
  },
  {
    id: 2,
    type: "file_upload",
    title: "Uploaded file",
    description: "Added 'report.pdf' to asset management",
    timestamp: "1 day ago",
    icon: Upload,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
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
  },
];

export default function ProfileActivity() {
  // userId will be used when connecting to real activity data
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#1a1a22] rounded-xl border border-gray-800/50 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-200">Recent Activity</h3>
            <p className="text-gray-400 text-sm">Your latest actions and interactions</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {mockActivities.map((activity, index) => {
            const Icon = activity.icon;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-lg bg-[#0f0f15] hover:bg-gray-800/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${activity.bgColor} flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${activity.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-gray-200 font-medium text-sm">{activity.title}</h4>
                  <p className="text-gray-400 text-sm mt-1">{activity.description}</p>
                  <p className="text-gray-500 text-xs mt-2">{activity.timestamp}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Load More Button */}
        <div className="mt-6 text-center">
          <button className="px-6 py-2 bg-[#0f0f15] hover:bg-gray-800/50 text-gray-300 rounded-lg transition-colors border border-gray-700/50 hover:border-gray-600/50">
            Load More Activity
          </button>
        </div>
      </div>
    </motion.div>
  );
}