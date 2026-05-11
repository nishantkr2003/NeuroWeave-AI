"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import UploadBox from "@/components/UploadBox";
import API from "@/lib/api";

export default function HomePage() {
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    const syncUser = async () => {
      try {
        if (!isSignedIn) return;

        // IMPORTANT: Use Clerk JWT Template token
        const token = await getToken({
          template: "neon",
        });

        if (!token) {
          console.error("No Clerk token found");
          return;
        }

        console.log("TOKEN:", token);

        await API.post(
          "/users/sync",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        

        console.log("User synced successfully");
      } catch (error: any) {
        console.error(
          "User sync failed:",
          error.response?.data || error.message,
        );
      }
    };

    syncUser();
  }, [isSignedIn, getToken]);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <ChatWindow />

          <div className="border-t border-white/10 p-4 bg-black/20">
            <UploadBox />
          </div>
        </div>
      </div>
    </div>
  );
}
