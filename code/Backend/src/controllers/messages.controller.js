import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";

const colorPalette = [
  "#4f46e5",
  "#0f6e56",
  "#b74a75",
  "#4ab78f",
  "#b7834a",
  "#4a8ab7",
  "#7c3aed",
  "#0ea5e9",
];

const buildParticipantKey = (participantIds) => {
  return [...new Set(participantIds.map((id) => String(id)))].sort().join(":");
};

const getDisplayName = (user) => {
  if (user.accountType === "organization") {
    return String(user.firstName || user.userName || "Organization").trim();
  }

  return String(`${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName || "User").trim();
};

const getInitials = (name) => {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "??";
  }

  return parts.map((part) => part.charAt(0)).join("").toUpperCase();
};

const getContactType = (user) => (user.accountType === "organization" ? "org" : "user");

const getColorForUser = (userId) => {
  const seed = String(userId || "");
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  return colorPalette[hash % colorPalette.length];
};

const formatRelativeTime = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffMinutes < 1) {
    return "now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }

  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const mapMessage = (message, currentUserId) => ({
  id: String(message._id),
  from: String(message.senderUserId) === String(currentUserId) ? "me" : "them",
  text: message.body,
  time: new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
});

const buildConversationSummary = (conversation, currentUserId, otherUser, unreadCount = 0) => ({
  id: String(otherUser._id),
  name: getDisplayName(otherUser),
  initials: getInitials(getDisplayName(otherUser)),
  type: getContactType(otherUser),
  online: Boolean(otherUser.isActive),
  time: formatRelativeTime(conversation.lastMessageAt),
  unread: unreadCount,
  preview: conversation.lastMessageText || "Start a conversation",
  color: getColorForUser(otherUser._id),
  conversationId: String(conversation._id),
});

const getConversationForCurrentUser = async (conversationId, currentUserId) => {
  const conversation = await Conversation.findById(conversationId).populate(
    "participants",
    "firstName lastName userName accountType isActive",
  );

  if (!conversation) {
    throw new AppError("Conversation not found.", 404, "CONVERSATION_NOT_FOUND");
  }

  const participantIds = conversation.participants.map((participant) => String(participant._id));
  if (!participantIds.includes(String(currentUserId))) {
    throw new AppError("You do not have access to this conversation.", 403, "FORBIDDEN");
  }

  return conversation;
};

const buildUnreadCountMap = async (conversationIds, currentUserId) => {
  if (conversationIds.length === 0) {
    return {};
  }

  const unreadAggregation = await Message.aggregate([
    {
      $match: {
        conversationId: { $in: conversationIds },
        senderUserId: { $ne: currentUserId },
        readBy: { $nin: [currentUserId] },
      },
    },
    {
      $group: {
        _id: "$conversationId",
        unread: { $sum: 1 },
      },
    },
  ]);

  return unreadAggregation.reduce((accumulator, entry) => {
    accumulator[String(entry._id)] = entry.unread;
    return accumulator;
  }, {});
};

const buildContactList = async (currentUser) => {
  const conversations = await Conversation.find({ participants: currentUser._id })
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .populate("participants", "firstName lastName userName accountType isActive");

  const unreadCountMap = await buildUnreadCountMap(
    conversations.map((conversation) => conversation._id),
    currentUser._id,
  );

  const conversationByOtherUserId = new Map();
  conversations.forEach((conversation) => {
    const otherParticipant = conversation.participants.find(
      (participant) => String(participant._id) !== String(currentUser._id),
    );

    if (otherParticipant) {
      conversationByOtherUserId.set(String(otherParticipant._id), conversation);
    }
  });

  return conversations
    .map((conversation) => {
      const otherUser = conversation.participants.find(
        (participant) => String(participant._id) !== String(currentUser._id),
      );

      if (!otherUser) {
        return null;
      }

      return buildConversationSummary(
        conversation,
        currentUser._id,
        otherUser,
        unreadCountMap[String(conversation._id)] || 0,
      );
    })
    .filter(Boolean);
};

export const getContacts = asyncHandler(async (req, res) => {
  const contacts = await buildContactList(req.user);

  return successResponse(res, 200, "Contacts fetched successfully.", {
    contacts,
  });
});

export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user._id })
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .populate("participants", "firstName lastName userName accountType isActive");

  const unreadCountMap = await buildUnreadCountMap(
    conversations.map((conversation) => conversation._id),
    req.user._id,
  );

  const summaries = conversations
    .map((conversation) => {
      const otherUser = conversation.participants.find(
        (participant) => String(participant._id) !== String(req.user._id),
      );

      if (!otherUser) {
        return null;
      }

      return buildConversationSummary(
        conversation,
        req.user._id,
        otherUser,
        unreadCountMap[String(conversation._id)] || 0,
      );
    })
    .filter(Boolean);

  return successResponse(res, 200, "Conversations fetched successfully.", {
    conversations: summaries,
  });
});

export const createConversation = asyncHandler(async (req, res) => {
  const participantUserId = String(req.body.participantUserId || "").trim();

  if (!participantUserId) {
    throw new AppError("participantUserId is required.", 400, "VALIDATION_ERROR");
  }

  if (String(participantUserId) === String(req.user._id)) {
    throw new AppError("You cannot start a conversation with yourself.", 400, "VALIDATION_ERROR");
  }

  const participant = await User.findById(participantUserId).select("firstName lastName userName accountType isActive");
  if (!participant) {
    throw new AppError("Participant not found.", 404, "USER_NOT_FOUND");
  }

  const participantKey = buildParticipantKey([req.user._id, participant._id]);

  let conversation = await Conversation.findOne({ participantKey });
  let created = false;
  if (!conversation) {
    conversation = await Conversation.create({
      participantKey,
      participants: [req.user._id, participant._id],
    });
    created = true;
  }

  return successResponse(res, created ? 201 : 200, "Conversation ready.", {
    conversation: {
      id: String(conversation._id),
      participantUserId: String(participant._id),
    },
    contact: buildConversationSummary(conversation, req.user._id, participant, 0),
  });
});

export const getConversationThread = asyncHandler(async (req, res) => {
  const conversation = await getConversationForCurrentUser(req.params.conversationId, req.user._id);

  const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
  const otherUser = conversation.participants.find(
    (participant) => String(participant._id) !== String(req.user._id),
  );

  return successResponse(res, 200, "Conversation thread fetched successfully.", {
    conversation: {
      id: String(conversation._id),
      participantUserId: otherUser ? String(otherUser._id) : null,
    },
    messages: messages.map((message) => mapMessage(message, req.user._id)),
  });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const body = String(req.body.body || req.body.text || "").trim();

  if (!body) {
    throw new AppError("Message body is required.", 400, "VALIDATION_ERROR");
  }

  const conversation = await getConversationForCurrentUser(req.params.conversationId, req.user._id);
  const recipientUser = conversation.participants.find(
    (participant) => String(participant._id) !== String(req.user._id),
  );

  if (!recipientUser) {
    throw new AppError("Conversation recipient not found.", 404, "USER_NOT_FOUND");
  }

  const message = await Message.create({
    conversationId: conversation._id,
    senderUserId: req.user._id,
    recipientUserId: recipientUser._id,
    body,
    readBy: [req.user._id],
  });

  conversation.lastMessageText = body;
  conversation.lastMessageAt = message.createdAt;
  conversation.lastSenderUserId = req.user._id;
  await conversation.save();

  return successResponse(res, 201, "Message sent successfully.", {
    conversation: {
      id: String(conversation._id),
      participantUserId: String(recipientUser._id),
    },
    message: mapMessage(message, req.user._id),
  });
});

export const markConversationRead = asyncHandler(async (req, res) => {
  const conversation = await getConversationForCurrentUser(req.params.conversationId, req.user._id);

  const result = await Message.updateMany(
    {
      conversationId: conversation._id,
      senderUserId: { $ne: req.user._id },
      readBy: { $nin: [req.user._id] },
    },
    {
      $addToSet: {
        readBy: req.user._id,
      },
    },
  );

  return successResponse(res, 200, "Conversation marked as read.", {
    matchedCount: result.matchedCount ?? 0,
    modifiedCount: result.modifiedCount ?? 0,
  });
});

export default {
  getContacts,
  getConversations,
  createConversation,
  getConversationThread,
  sendMessage,
  markConversationRead,
};