import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authHeaders = async () => {
  const token = await window.Clerk.session.getToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

/* Create conversation */
export const createConversation = async (title) => {
  const headers = await authHeaders();

  const res = await axios.post(`${API}/conversations`, { title }, { headers });

  return res.data.conversation;
};

/* Fetch all conversations */
export const fetchConversations = async () => {
  const headers = await authHeaders();

  const res = await axios.get(`${API}/conversations`, { headers });

  return res.data.conversations;
};

/* Fetch conversation messages */
export const fetchMessages = async (conversationId) => {
  const headers = await authHeaders();

  const res = await axios.get(`${API}/messages/${conversationId}`, { headers });

  return res.data.messages;
};
