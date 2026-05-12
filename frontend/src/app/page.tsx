// // "use client";

// // import { useEffect } from "react";
// // import { useAuth } from "@clerk/nextjs";

// // import Navbar from "@/components/Navbar";
// // import Sidebar from "@/components/Sidebar";
// // import ChatWindow from "@/components/ChatWindow";
// // import UploadBox from "@/components/UploadBox";
// // import API from "@/lib/api";

// // export default function HomePage() {
// //   const { isSignedIn, getToken } = useAuth();

// //   useEffect(() => {
// //     const syncUser = async () => {
// //       try {
// //         if (!isSignedIn) return;

// //         // IMPORTANT: Use Clerk JWT Template token
// //         const token = await getToken({
// //           template: "neon",
// //         });

// //         if (!token) {
// //           console.error("No Clerk token found");
// //           return;
// //         }

// //         console.log("TOKEN:", token);

// //         await API.post(
// //           "/users/sync",
// //           {},
// //           {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           },
// //         );

// //         console.log("User synced successfully");
// //       } catch (error: any) {
// //         console.error(
// //           "User sync failed:",
// //           error.response?.data || error.message,
// //         );
// //       }
// //     };

// //     syncUser();
// //   }, [isSignedIn, getToken]);

// //   return (
// //     <div className="h-screen flex flex-col">
// //       <Navbar />

// //       <div className="flex flex-1 overflow-hidden">
// //         <Sidebar />

// //         <div className="flex-1 flex flex-col">
// //           <ChatWindow />

// //           <div className="border-t border-white/10 p-4 bg-black/20">
// //             <UploadBox />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect } from "react";
// import { useAuth } from "@clerk/nextjs";

// import Navbar from "@/components/Navbar";
// import Sidebar from "@/components/Sidebar";
// import ChatWindow from "@/components/ChatWindow";
// import UploadBox from "@/components/UploadBox";

// import API from "@/lib/api";

// import useChatStore from "@/store/chatStore";

// export default function HomePage() {
//   const { isSignedIn, getToken } = useAuth();

//   const { activeConversationId, setActiveConversation } = useChatStore();

//   useEffect(() => {
//     const initializeUserAndChat = async () => {
//       try {
//         /* Must be signed in */
//         if (!isSignedIn) return;

//         /* Clerk JWT template token */
//         const token = await getToken({
//           template: "neon",
//         });

//         if (!token) {
//           console.error("No Clerk token found");
//           return;
//         }

//         /* Sync user */
//         await API.post(
//           "/users/sync",
//           {},
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           },
//         );

//         console.log("User synced successfully");

//         /* Skip if active chat already exists */
//         if (activeConversationId) {
//           return;
//         }

//         /* Auto-create ChatGPT-style session */
//         const response = await API.post(
//           "/conversations",
//           {
//             title: "New Chat",
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           },
//         );

//         if (response.data?.success) {
//           const newConversationId = response.data.conversation.id;

//           setActiveConversation(newConversationId);

//           console.log("Active conversation created:", newConversationId);
//         }
//       } catch (error: any) {
//         console.error(
//           "Initialization failed:",
//           error.response?.data || error.message,
//         );
//       }
//     };

//     initializeUserAndChat();
//   }, [isSignedIn, getToken, activeConversationId, setActiveConversation]);

//   return (
//     <div className="h-screen flex flex-col">
//       <Navbar />

//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar />

//         <div className="flex-1 flex flex-col">
//           <ChatWindow />

//           {/* <div className="border-t border-white/10 p-4 bg-black/20">
//             <UploadBox />
//           </div> */}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";

import API from "@/lib/api";

import useChatStore from "@/store/chatStore";

export default function HomePage() {
  const { isSignedIn, getToken } = useAuth();

  const { activeConversationId, setActiveConversation } = useChatStore();

  useEffect(() => {
    const initializeUserAndChat = async () => {
      try {
        if (!isSignedIn) return;

        const token = await getToken({
          template: "neon",
        });

        if (!token) {
          console.error("No Clerk token found");
          return;
        }

        /* Sync user */
        await API.post(
          "/users/sync",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        /* Auto-create first chat */
        if (activeConversationId) return;

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
          setActiveConversation(response.data.conversation.id);
        }
      } catch (error: any) {
        console.error(
          "Initialization failed:",
          error.response?.data || error.message,
        );
      }
    };

    initializeUserAndChat();
  }, [isSignedIn, getToken, activeConversationId, setActiveConversation]);

  return (
    <div className="h-screen flex flex-col bg-[#0d1117] text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
}