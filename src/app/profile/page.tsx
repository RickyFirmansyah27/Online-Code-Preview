"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import Header from "../(root)/_components/Header";
import ProfileCover from "./_components/ProfileCover";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileStats from "./_components/ProfileStats";
import ProfileTabs from "./_components/ProfileTabs";
import ProfileSettings from "./_components/ProfileSettings";
import ProfileActivity from "./_components/ProfileActivity";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [convexUser, setConvexUser] = useState<{ isPro?: boolean; createdAt?: string } | null>(null);
  const [stats, setStats] = useState({
    totalSnippets: 0,
    totalFiles: 0,
    aiInteractions: 0,
  });
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded || !user) return;

      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

      try {
        // Fetch user data from Convex
        const userData = await convex.query(api.users.getUser, {
          userId: user.id,
        });
        setConvexUser(userData);

        // Fetch user stats (you might need to create these queries)
        // For now, using placeholder data
        setStats({
          totalSnippets: 0, // await convex.query(api.snippets.getUserSnippetCount, { userId: user.id }),
          totalFiles: 0, // await convex.query(api.storage.getUserFileCount, { userId: user.id }),
          aiInteractions: 0, // await convex.query(api.conversations.getUserInteractionCount, { userId: user.id }),
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-200 mb-4">Please sign in</h1>
          <p className="text-gray-400">You need to be signed in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Cover Photo */}
          <ProfileCover />

          {/* Profile Header */}
          <ProfileHeader user={user} convexUser={convexUser} />

          {/* Stats Grid */}
          <ProfileStats stats={stats} />

          {/* Tabs */}
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Tab Content */}
          {activeTab === "settings" ? (
            <ProfileSettings />
          ) : (
            <ProfileActivity userId={user.id} />
          )}
        </div>
      </main>
    </div>
  );
}