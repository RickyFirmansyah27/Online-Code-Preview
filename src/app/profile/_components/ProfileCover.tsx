"use client";

import { motion } from "framer-motion";

export default function ProfileCover() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-48 w-full overflow-hidden rounded-t-2xl bg-gradient-to-r from-[#1a1a22] via-[#0f0f15] to-[#1a1a22]"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-20 right-20 w-24 h-24 bg-gradient-to-bl from-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-10 left-20 w-20 h-20 bg-gradient-to-tr from-emerald-500/20 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    </motion.div>
  );
}