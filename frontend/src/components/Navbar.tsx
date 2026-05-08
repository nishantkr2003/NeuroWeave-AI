"use client";

import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 glass-card px-6 py-4 flex justify-between items-center backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-500/20">
          <Sparkles className="text-indigo-400" size={22} />
        </div>

        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Multi-Modal AI Assistant
          </h1>

          <p className="text-xs text-gray-400">
            Image • Video • Audio • Document Intelligence
          </p>
        </div>
      </div>

      <div>
        {!isSignedIn ? (
          <SignInButton mode="redirect" forceRedirectUrl="/sign-in">
            <button className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium shadow-lg">
              Get Started
            </button>
          </SignInButton>
        ) : (
          <UserButton afterSignOutUrl="/" />
        )}
      </div>
    </nav>
  );
}
