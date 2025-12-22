"use client";

import { motion } from "framer-motion";
import { User, Mail, Calendar, Crown, Camera, Sparkles, Edit3, Share2 } from "lucide-react";
import Image from "next/image";

interface ProfileHeaderProps {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    username?: string | null;
    primaryEmailAddress?: { emailAddress: string } | null;
    createdAt?: Date | null;
    imageUrl?: string;
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
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e1e28] via-[#1a1a22] to-[#0f0f15] border border-gray-800/50 p-8"
    >
      {/* Enhanced Background decorations */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl -translate-y-40 translate-x-40" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl translate-y-32 -translate-x-32" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-purple-500/5 to-transparent rounded-full blur-3xl" />

      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar with Clerk Profile Image */}
        <motion.div
          className="relative group"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Outer glow ring */}
          <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-full opacity-60 blur-sm group-hover:opacity-80 transition-opacity duration-300" />

          {/* Avatar container */}
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 shadow-2xl shadow-blue-500/25">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#1a1a22]">
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={`${user.firstName || "User"}'s profile`}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold bg-gradient-to-br from-blue-500 to-purple-600">
                  {user.firstName?.[0] || user.username?.[0] || "U"}
                </div>
              )}
            </div>
          </div>

          {/* Pro badge */}
          {convexUser?.isPro && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
              className="absolute -top-1 -right-1 w-9 h-9 bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 ring-2 ring-[#1a1a22]"
            >
              <Crown className="w-4 h-4 text-white" />
            </motion.div>
          )}

          {/* Camera overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </motion.div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 text-transparent bg-clip-text"
            >
              {user.firstName || ''} {user.lastName || ''}
            </motion.h1>
            {convexUser?.isPro && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 text-amber-400 text-sm font-medium shadow-lg shadow-amber-500/10"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Pro Member
              </motion.span>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3 text-gray-400"
          >
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="p-1.5 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <User className="w-4 h-4 text-blue-400" />
              </div>
              <span className="group-hover:text-gray-300 transition-colors">@{user.username || "username"}</span>
            </div>
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="p-1.5 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                <Mail className="w-4 h-4 text-purple-400" />
              </div>
              <span className="group-hover:text-gray-300 transition-colors">{user.primaryEmailAddress?.emailAddress}</span>
            </div>
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="p-1.5 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                <Calendar className="w-4 h-4 text-green-400" />
              </div>
              <span className="group-hover:text-gray-300 transition-colors">Joined {formatDate(user.createdAt?.toISOString())}</span>
            </div>
          </motion.div>
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-3"
        >
          <button className="group relative px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl transition-all duration-300 font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center gap-2 overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </button>
          <button className="group relative px-5 py-2.5 bg-[#1a1a22] hover:bg-[#252530] text-gray-300 hover:text-white rounded-xl transition-all duration-300 border border-gray-700 hover:border-gray-600 flex items-center gap-2">
            <Share2 className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
            Share Profile
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
