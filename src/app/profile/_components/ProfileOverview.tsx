"use client";

import { motion } from "framer-motion";
import { TrendingUp, Clock, Zap, Target, Award, BarChart3 } from "lucide-react";

interface ProfileOverviewProps {
    stats: {
        totalSnippets: number;
        totalFiles: number;
        aiInteractions: number;
    };
}

export default function ProfileOverview({ stats }: ProfileOverviewProps) {
    const totalActivity = stats.totalSnippets + stats.totalFiles + stats.aiInteractions;

    const quickStats = [
        { label: "This Week", value: "+5", icon: TrendingUp, color: "text-green-400" },
        { label: "Streak", value: "7 days", icon: Zap, color: "text-yellow-400" },
        { label: "Rank", value: "Pro", icon: Award, color: "text-purple-400" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {quickStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-br from-[#1e1e28] via-[#1a1a22] to-[#0f0f15] rounded-xl border border-gray-800/50 p-4 flex items-center gap-3"
                        >
                            <div className={`p-2 rounded-lg bg-[#0f0f15] ${stat.color}`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">{stat.label}</p>
                                <p className="text-white font-semibold">{stat.value}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Activity Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#1e1e28] via-[#1a1a22] to-[#0f0f15] rounded-2xl border border-gray-800/50 overflow-hidden"
            >
                <div className="p-6 border-b border-gray-800/50 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20">
                            <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-white">Activity Overview</h3>
                            <p className="text-gray-400 text-sm">Your productivity at a glance</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Progress bars */}
                        <div className="space-y-4">
                            <h4 className="text-gray-300 font-medium flex items-center gap-2">
                                <Target className="w-4 h-4 text-blue-400" />
                                Monthly Goals
                            </h4>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-gray-400">Code Snippets</span>
                                        <span className="text-blue-400">{stats.totalSnippets}/10</span>
                                    </div>
                                    <div className="h-2 bg-[#0f0f15] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((stats.totalSnippets / 10) * 100, 100)}%` }}
                                            transition={{ delay: 0.5, duration: 0.8 }}
                                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-gray-400">Files Uploaded</span>
                                        <span className="text-emerald-400">{stats.totalFiles}/20</span>
                                    </div>
                                    <div className="h-2 bg-[#0f0f15] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((stats.totalFiles / 20) * 100, 100)}%` }}
                                            transition={{ delay: 0.6, duration: 0.8 }}
                                            className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="text-gray-400">AI Interactions</span>
                                        <span className="text-purple-400">{stats.aiInteractions}/50</span>
                                    </div>
                                    <div className="h-2 bg-[#0f0f15] rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((stats.aiInteractions / 50) * 100, 100)}%` }}
                                            transition={{ delay: 0.7, duration: 0.8 }}
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary stats */}
                        <div className="flex items-center justify-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="relative"
                            >
                                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
                                    <div className="w-28 h-28 rounded-full bg-[#1a1a22] flex flex-col items-center justify-center">
                                        <span className="text-4xl font-bold text-white">{totalActivity}</span>
                                        <span className="text-gray-400 text-sm">Total</span>
                                    </div>
                                </div>
                                <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-xl -z-10" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Recent Activity Hint */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center py-4"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a22] border border-gray-800/50 text-gray-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Switch to Activity tab for detailed history</span>
                </div>
            </motion.div>
        </motion.div>
    );
}
