import { create } from "zustand";

const useChatStore = create((set) => ({
  conversations: [],
  activeConversation: null,
  messages: [],

  setConversations: (conversations) => set({ conversations }),

  setActiveConversation: (conversation) =>
    set({
      activeConversation: conversation,
    }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  resetChat: () =>
    set({
      activeConversation: null,
      messages: [],
    }),
}));

export default useChatStore;
