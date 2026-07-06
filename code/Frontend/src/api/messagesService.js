import apiClient from "./apiClient";

const PREFIX = "/api/v1/messages";

export const getMessagingContacts = async () => {
  const response = await apiClient.get(`${PREFIX}/contacts`);
  return response.data;
};

export const getConversationThread = async (conversationId) => {
  const response = await apiClient.get(`${PREFIX}/conversations/${conversationId}`);
  return response.data;
};

export const createMessagingConversation = async (participantUserId) => {
  const response = await apiClient.post(`${PREFIX}/conversations`, { participantUserId });
  return response.data;
};

export const sendConversationMessage = async (conversationId, body) => {
  const response = await apiClient.post(`${PREFIX}/conversations/${conversationId}/messages`, { body });
  return response.data;
};

export const markConversationRead = async (conversationId) => {
  const response = await apiClient.patch(`${PREFIX}/conversations/${conversationId}/read`);
  return response.data;
};

export default apiClient;