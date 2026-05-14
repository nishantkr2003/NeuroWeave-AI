"use client";

import { useEffect, useState } from "react";

import {
  Plus,
  MessageSquare,
  Pencil,
  Trash2,
  X,
  ChevronRight,
  ChevronDown,
  Image,
  FileText,
  Video,
  Mic,
} from "lucide-react";

import { useAuth } from "@clerk/nextjs";

import API from "@/lib/api";

import useChatStore from "@/store/chatStore";

const workspaceItems = [
  {
    label: "Images",
    icon: Image,
  },
  {
    label: "Documents",
    icon: FileText,
  },
  {
    label: "Videos",
    icon: Video,
  },
  {
    label: "Audio",
    icon: Mic,
  },
];

export default function Sidebar() {
  const { getToken } = useAuth();

  const {
    conversations,
    setConversations,
    activeConversationId,
    setActiveConversation,
    setMessages,
    clearMessages,
    renameConversation,
    deleteConversation,
    isSidebarOpen,
    closeSidebar,
  } = useChatStore();

  const [editingId, setEditingId] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");

  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  /* Load conversations */
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = await getToken({
          template: "neon",
        });

        if (!token) return;

        const response = await API.get("/conversations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data?.success) {
          setConversations(response.data.conversations);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchConversations();
  }, [getToken, setConversations]);

  /* New chat */
  const handleNewChat = async () => {
    try {
      const token = await getToken({
        template: "neon",
      });

      if (!token) return;

      const response = await API.post(
        "/conversations",
        {
          title: "New Chat",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data?.success) {
        const newChat = response.data.conversation;

        setConversations([newChat, ...conversations]);

        setActiveConversation(newChat.id, newChat.title);

        clearMessages();

        closeSidebar();
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* Switch conversation */
  const handleConversationClick = async (
    conversationId: string,
    title: string,
  ) => {
    try {
      const token = await getToken({
        template: "neon",
      });

      if (!token) return;

      setActiveConversation(conversationId, title);

      const response = await API.get(`/messages/${conversationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success) {
        setMessages(response.data.messages);
      }

      closeSidebar();
    } catch (error) {
      console.error(error);
    }
  };

  /* Rename */
  const handleRename = (conversationId: string) => {
    if (!newTitle.trim()) return;

    renameConversation(conversationId, newTitle);

    setEditingId(null);
  };

  /* Delete */
  const handleDelete = (conversationId: string) => {
    deleteConversation(conversationId);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed lg:relative z-50 lg:z-0 top-0 left-0 h-full w-72 bg-[#0a0f16] border-r border-white/10 flex flex-col transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Mobile close */}
        <div className="lg:hidden flex justify-end p-3">
          <button
            onClick={closeSidebar}
            className="p-2 rounded-xl hover:bg-white/5"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* New Chat */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 py-3 font-medium transition"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-3 space-y-2">
          <h2 className="text-xs uppercase tracking-wider text-gray-500 px-2 mb-2">
            Recent Chats
          </h2>

          {conversations.map((convo: any) => (
            <div
              key={convo.id}
              className={`group rounded-2xl ${
                activeConversationId === convo.id
                  ? "bg-white/10"
                  : "hover:bg-white/5"
              }`}
            >
              <div className="flex items-center">
                <button
                  onClick={() => handleConversationClick(convo.id, convo.title)}
                  className="flex-1 flex items-center gap-3 px-3 py-3 text-left"
                >
                  <MessageSquare size={16} className="text-gray-400" />

                  {editingId === convo.id ? (
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onBlur={() => handleRename(convo.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRename(convo.id);
                        }
                      }}
                      autoFocus
                      className="bg-transparent text-sm text-white outline-none w-full"
                    />
                  ) : (
                    <span className="truncate text-sm text-gray-200">
                      {convo.title || "Untitled Chat"}
                    </span>
                  )}
                </button>

                <div className="hidden group-hover:flex items-center pr-2">
                  <button
                    onClick={() => {
                      setEditingId(convo.id);

                      setNewTitle(convo.title);
                    }}
                    className="p-1.5 hover:bg-white/10 rounded-lg"
                  >
                    <Pencil size={14} className="text-gray-400" />
                  </button>

                  <button
                    onClick={() => handleDelete(convo.id)}
                    className="p-1.5 hover:bg-white/10 rounded-lg"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workspace Toggle */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            className="w-full flex items-center justify-between px-2 py-2 rounded-xl hover:bg-white/5 transition"
          >
            <span className="text-xs uppercase tracking-wider text-gray-500">
              Workspace
            </span>

            {workspaceOpen ? (
              <ChevronDown size={16} className="text-gray-500" />
            ) : (
              <ChevronRight size={16} className="text-gray-500" />
            )}
          </button>

          {/* Collapsible Items */}
          {workspaceOpen && (
            <div className="mt-3 space-y-2">
              {workspaceItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition"
                  >
                    <Icon size={18} className="text-gray-400" />

                    <span className="text-sm text-gray-300">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-gray-500 leading-relaxed">
            Upload once. Ask forever.
          </p>
        </div>
      </aside>
    </>
  );
}
