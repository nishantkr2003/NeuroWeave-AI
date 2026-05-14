import { create } from "zustand";

const useChatStore = create((set) => ({
  /* Active conversation */
  activeConversationId: null,

  /* Active chat title */
  activeConversationTitle: "New Chat",

  /* Sidebar state (mobile) */
  isSidebarOpen: false,

  /* Conversations list */
  conversations: [],

  /* Messages */
  messages: [],

  /* Upload progress */
  uploadProgress: 0,

  /* Set active conversation */
  setActiveConversation: (conversationId, title = "New Chat") =>
    set({
      activeConversationId: conversationId,
      activeConversationTitle: title,
    }),

  /* Rename active chat */
  renameConversation: (conversationId, newTitle) =>
    set((state) => ({
      conversations: state.conversations.map((convo) =>
        convo.id === conversationId
          ? {
              ...convo,
              title: newTitle,
            }
          : convo,
      ),
      activeConversationTitle:
        state.activeConversationId === conversationId
          ? newTitle
          : state.activeConversationTitle,
    })),

  /* Delete chat */
  deleteConversation: (conversationId) =>
    set((state) => {
      const updated = state.conversations.filter(
        (convo) => convo.id !== conversationId,
      );

      return {
        conversations: updated,
        activeConversationId:
          state.activeConversationId === conversationId
            ? null
            : state.activeConversationId,
        activeConversationTitle:
          state.activeConversationId === conversationId
            ? "New Chat"
            : state.activeConversationTitle,
        messages:
          state.activeConversationId === conversationId ? [] : state.messages,
      };
    }),

  /* Sidebar toggle */
  toggleSidebar: () =>
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    })),

  closeSidebar: () =>
    set({
      isSidebarOpen: false,
    }),

  /* Upload progress */
  setUploadProgress: (progress) =>
    set({
      uploadProgress: progress,
    }),

  /* Store conversations */
  setConversations: (conversations) =>
    set({
      conversations,
    }),

  /* Messages */
  setMessages: (messages) =>
    set({
      messages,
    }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  clearMessages: () =>
    set({
      messages: [],
    }),
}));

export default useChatStore;
