"use client";

import {
  Image,
  FileText,
  Video,
  Mic,
  Layers,
  PlusCircle
} from "lucide-react";

const menuItems = [
  { label: "Images", icon: Image },
  { label: "Videos", icon: Video },
  { label: "Audio", icon: Mic },
  { label: "Documents", icon: FileText },
  { label: "Compare", icon: Layers }
];

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen glass-card border-r border-white/10 p-5 flex flex-col">
      <button className="w-full mb-6 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-2xl font-semibold shadow-lg">
        <PlusCircle size={18} />
        New Chat
      </button>

      <div>
        <h2 className="text-sm uppercase tracking-wider text-gray-400 mb-4">
          Media Workspace
        </h2>

        <div className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                className="hover-glow flex items-center gap-4 w-full p-4 rounded-2xl bg-white/5 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/30 transition-all"
              >
                <div className="p-2 rounded-xl bg-indigo-500/10">
                  <Icon size={20} className="text-indigo-400" />
                </div>

                <span className="font-medium text-gray-200">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-white/10">
        <p className="text-sm text-gray-400">
          Upload, analyze, compare, and chat with all media types.
        </p>
      </div>
    </aside>
  );
}