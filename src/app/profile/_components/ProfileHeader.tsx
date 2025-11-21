"use client";

import { motion } from "framer-motion";
import { User, Mail, Calendar, Crown } from "lucide-react";

interface ProfileHeaderProps {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    username?: string | null;
    primaryEmailAddress?: { emailAddress: string } | null;
    createdAt?: Date | null;
  };
  convexUser: { isPro?: boolean; createdAt?: string } | null;
}

export default function ProfileHeader({ user, convexUser }: ProfileHeaderProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a22] to-[#0f0f15] border border-gray-800/50 p-8"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user.firstName?.[0] || user.username?.[0] || "U"}
          </div>
          {convexUser?.isPro && (
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Crown className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
              {user.firstName || ''} {user.lastName || ''}
            </h1>
            {convexUser?.isPro && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium">
                <Crown className="w-3 h-3" />
                Pro Member
              </span>
            )}
          </div>

          <div className="space-y-2 text-gray-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>@{user.username || "username"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{user.primaryEmailAddress?.emailAddress}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Joined {formatDate(user.createdAt?.toISOString())}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">
            Edit Profile
          </button>
          <button className="px-4 py-2 bg-[#1a1a22] hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700">
            Share Profile
          </button>
        </div>
      </div>
    </motion.div>
  );
}
