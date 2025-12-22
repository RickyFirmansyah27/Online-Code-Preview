"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Image from "next/image";
import Header from "../(root)/_components/Header";
import {
  User,
  Mail,
  Calendar,
  Crown,
  Settings,
  LogOut,
  ExternalLink,
  Shield
} from "lucide-react";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  const formatDate = (date?: Date | null) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-800 flex items-center justify-center">
            <User className="w-8 h-8 text-gray-500" />
          </div>
          <h1 className="text-xl font-semibold text-gray-200">Please sign in</h1>
          <p className="text-gray-500 text-sm">You need to be signed in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Card */}
          <div className="bg-[#12121a] rounded-2xl border border-gray-800/50 overflow-hidden">
            {/* Header Background */}
            <div className="h-20 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20" />

            {/* Profile Content */}
            <div className="px-6 pb-6">
              {/* Avatar */}
              <div className="relative -mt-12 mb-4">
                <div className="w-24 h-24 rounded-full ring-4 ring-[#12121a] overflow-hidden bg-[#1a1a24]">
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                      {user.firstName?.[0] || user.username?.[0] || "U"}
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Badge */}
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h1>
              </div>

              {/* Info List */}
              <div className="space-y-3">
                {user.username && (
                  <div className="flex items-center gap-3 text-gray-400">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">@{user.username}</span>
                  </div>
                )}

                <div className="flex items-center gap-3 text-gray-400">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{user.primaryEmailAddress?.emailAddress}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-400">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#12121a] rounded-2xl border border-gray-800/50 divide-y divide-gray-800/50">
            <button
              onClick={() => window.open('https://accounts.clerk.dev/user', '_blank')}
              className="w-full flex items-center justify-between p-4 hover:bg-[#1a1a24] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Settings className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-200">Account Settings</p>
                  <p className="text-xs text-gray-500">Manage your account on Clerk</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
            </button>

            <button
              onClick={() => window.open('https://accounts.clerk.dev/user/security', '_blank')}
              className="w-full flex items-center justify-between p-4 hover:bg-[#1a1a24] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-200">Security</p>
                  <p className="text-xs text-gray-500">Password & two-factor authentication</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
            </button>
          </div>

          {/* Sign Out */}
          <button
            onClick={() => window.location.href = '/sign-out'}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </motion.div>
      </main>
    </div>
  );
}