const USERS_KEY = "ag_users";
const CONVERSATIONS_KEY = "ag_conversations";
const ACTIVE_USER_KEY = "ag_active_user";
const GUEST_USER_ID = "guest-user";

const DEFAULT_USERS = [
  {
    id: "demo-user-1",
    name: "Alex",
    email: "alex@demo.com",
    password: "demo123",
    type: "user",
  },
  {
    id: "demo-user-2",
    name: "Maya",
    email: "maya@demo.com",
    password: "demo123",
    type: "user",
  },
  {
    id: "demo-org-1",
    name: "Green Earth Org",
    email: "contact@greenearth.org",
    password: "demo123",
    type: "organization",
  },
  {
    id: GUEST_USER_ID,
    name: "Guest",
    email: "guest@local",
    password: "",
    type: "guest",
  },
];

function safeReadJson(key, fallback) {
  try {
    const rawValue = localStorage.getItem(key);
    if (!rawValue) return fallback;
    return JSON.parse(rawValue);
  } catch {
    return fallback;
  }
}

function safeWriteJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

function createId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function getConversationKey(userAId, userBId) {
  return [userAId, userBId].sort().join("__");
}

function seedDefaultsIfNeeded() {
  const existingUsers = safeReadJson(USERS_KEY, []);
  if (!Array.isArray(existingUsers) || existingUsers.length === 0) {
    safeWriteJson(USERS_KEY, DEFAULT_USERS);
  }
  const existingConversations = safeReadJson(CONVERSATIONS_KEY, {});
  if (!existingConversations || typeof existingConversations !== "object") {
    safeWriteJson(CONVERSATIONS_KEY, {});
  }
}

function getAllUsers() {
  seedDefaultsIfNeeded();
  const users = safeReadJson(USERS_KEY, []);

  const hasGuest = users.some((user) => user.id === GUEST_USER_ID);
  if (hasGuest) {
    return users;
  }

  const updatedUsers = [
    ...users,
    {
      id: GUEST_USER_ID,
      name: "Guest",
      email: "guest@local",
      password: "",
      type: "guest",
    },
  ];
  saveUsers(updatedUsers);
  return updatedUsers;
}

function saveUsers(users) {
  safeWriteJson(USERS_KEY, users);
}

function getAllConversations() {
  seedDefaultsIfNeeded();
  return safeReadJson(CONVERSATIONS_KEY, {});
}

function saveAllConversations(conversations) {
  safeWriteJson(CONVERSATIONS_KEY, conversations);
}

function getUserById(userId) {
  return getAllUsers().find((user) => user.id === userId) || null;
}

function setActiveUser(userId) {
  try {
    localStorage.setItem(ACTIVE_USER_KEY, userId);
  } catch {
    return;
  }
}

function getActiveUser() {
  try {
    const activeUserId = localStorage.getItem(ACTIVE_USER_KEY);
    if (!activeUserId) return null;
    return getUserById(activeUserId);
  } catch {
    return null;
  }
}

function ensureGuestUserSession() {
  const currentUser = getActiveUser();
  if (currentUser) {
    return currentUser;
  }

  const guestUser = getUserById(GUEST_USER_ID);
  if (guestUser) {
    setActiveUser(guestUser.id);
    return guestUser;
  }

  return null;
}

function registerUser({ name, email, password, type = "user" }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return { success: false, error: "Email is required" };
  }

  const users = getAllUsers();
  const existing = users.find(
    (user) => normalizeEmail(user.email) === normalizedEmail,
  );
  if (existing) {
    return { success: false, error: "Email already registered" };
  }

  const newUser = {
    id: createId("user"),
    name: name?.trim() || normalizedEmail.split("@")[0],
    email: normalizedEmail,
    password: String(password || ""),
    type,
  };

  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
  setActiveUser(newUser.id);

  return { success: true, user: newUser };
}

function loginUser({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const users = getAllUsers();

  const user = users.find(
    (item) => normalizeEmail(item.email) === normalizedEmail,
  );
  if (!user) {
    return { success: false, error: "User not found" };
  }

  if (user.password !== String(password || "")) {
    return { success: false, error: "Invalid password" };
  }

  setActiveUser(user.id);
  return { success: true, user };
}

function getContacts(forUserId) {
  return getAllUsers().filter((user) => user.id !== forUserId);
}

function getConversation(userId, contactId) {
  const conversations = getAllConversations();
  const key = getConversationKey(userId, contactId);
  return conversations[key] || [];
}

function generateComputedReply(content, receiverName) {
  const normalized = String(content || "").toLowerCase();

  if (normalized.includes("hello") || normalized.includes("hi")) {
    return `Hello! This is a computed server reply from ${receiverName}.`;
  }
  if (normalized.includes("price") || normalized.includes("cost")) {
    return `Server response: ${receiverName} will share pricing details soon.`;
  }
  if (normalized.includes("help") || normalized.includes("support")) {
    return `Server response: ${receiverName} support team has received your request.`;
  }
  return `Server computed reply from ${receiverName}: We received your message - "${content}".`;
}

async function sendMessageAndComputeReply({ fromUserId, toUserId, content }) {
  const trimmedContent = String(content || "").trim();
  if (!trimmedContent) {
    return { success: false, error: "Message cannot be empty" };
  }

  const sender = getUserById(fromUserId);
  const receiver = getUserById(toUserId);
  if (!sender || !receiver) {
    return { success: false, error: "Invalid users for this conversation" };
  }

  const conversations = getAllConversations();
  const key = getConversationKey(fromUserId, toUserId);
  const currentMessages = conversations[key] || [];

  const userMessage = {
    id: createId("msg"),
    fromUserId,
    toUserId,
    text: trimmedContent,
    senderType: "user",
    timestamp: new Date().toISOString(),
  };

  const computedReply = {
    id: createId("msg"),
    fromUserId: toUserId,
    toUserId: fromUserId,
    text: generateComputedReply(trimmedContent, receiver.name),
    senderType: "server",
    timestamp: new Date().toISOString(),
  };

  conversations[key] = [...currentMessages, userMessage, computedReply];
  saveAllConversations(conversations);

  await new Promise((resolve) => setTimeout(resolve, 250));

  return {
    success: true,
    messages: conversations[key],
  };
}

export {
  getAllUsers,
  getActiveUser,
  ensureGuestUserSession,
  loginUser,
  registerUser,
  getContacts,
  getConversation,
  sendMessageAndComputeReply,
};
