"use client";

import { useEffect, useState } from "react";
import { useUser, SignedIn } from "@clerk/nextjs";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";
import RunButton from "./RunButton";
import HeaderProfileBtn from "./HeaderProfileBtn";
import Logo from "./Logo";
import FileManage from "./FileManage";
import AI from "./AI";

function Header() {
  const { user, isLoaded } = useUser();
  const [convexUser, setConvexUser] = useState<{ isPro?: boolean } | null>(
    null
  );

  useEffect(() => {
    const fetchConvexUser = async () => {
      if (!isLoaded || !user) return setConvexUser(null);
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
      try {
        const result = await convex.query(api.users.getUser, {
          userId: user.id,
        });
        setConvexUser(result);
      } catch {
        setConvexUser(null);
      }
    };

    fetchConvexUser();
  }, [user, isLoaded]);

  return (
    <div className="relative z-10 w-full">
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row items-center justify-between bg-[#0a0a0f]/80 backdrop-blur-xl p-4 sm:p-6 mb-4 rounded-lg w-full">
        {/* Kiri: Logo + Nav */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between sm:justify-start gap-4">
          <Logo />

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center sm:justify-start gap-2 w-full sm:w-auto">
            <FileManage />
            <AI />
          </nav>
        </div>

        {/* Kanan: Aksi */}
        <div className="w-full flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3">
          {/* Theme + Language + Run + Profile */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3">
            <div className="sm:border-l border-gray-800 pl-0 sm:pl-3">
              <ThemeSelector />
            </div>

            <div className="sm:border-l border-gray-800 pl-0 sm:pl-3">
              <LanguageSelector hasAccess={!!convexUser?.isPro} />
            </div>

            <SignedIn>
              <RunButton />
            </SignedIn>

            <div className="sm:border-l border-gray-800 pl-0 sm:pl-3">
              <HeaderProfileBtn />
            </div>

            <div className="flex justify-center min-w-[120px]">
              {(!convexUser || !convexUser.isPro) && (
                <Link
                  href="/pricing"
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 text-amber-400 hover:text-amber-300" />
                  <span className="text-sm font-medium text-amber-400/90 hover:text-amber-300">
                    Pro
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
