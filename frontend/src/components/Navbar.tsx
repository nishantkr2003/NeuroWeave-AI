"use client";

import { useUser } from "@clerk/nextjs";

import { Sparkles } from "lucide-react";

export default function Navbar() {
  const { user } = useUser();

  return (
    <header className="h-14 border-b border-white/10 bg-[#0d1117]/95 backdrop-blur flex items-center justify-between px-6">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-indigo-500/15 flex items-center justify-center">
          <Sparkles className="text-indigo-400" size={18} />
        </div>

        <div>
          <h1 className="text-sm font-semibold text-white leading-none">
            Multi-Modal AI
          </h1>

          <p className="text-[11px] text-gray-500 leading-none mt-1">
            Upload once. Ask anything.
          </p>
        </div>
      </div>

      {/* User */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-sm text-white font-medium">
            {user?.firstName || "User"}
          </span>

          <span className="text-xs text-gray-500">AI Workspace</span>
        </div>

        <img
          src={user?.imageUrl || "/default-avatar.png"}
          alt="Profile"
          className="w-9 h-9 rounded-full border border-white/10"
        />
      </div>
    </header>
  );
}
