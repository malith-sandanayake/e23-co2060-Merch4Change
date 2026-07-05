import { Router } from "express";

import protect from "../middlewares/auth.js";
import {
  createConversation,
  getContacts,
  getConversationThread,
  getConversations,
  markConversationRead,
  sendMessage,
} from "../controllers/messages.controller.js";

const router = Router();

router.use(protect);

router.get("/contacts", getContacts);
router.get("/conversations", getConversations);
router.post("/conversations", createConversation);
router.get("/conversations/:conversationId", getConversationThread);
router.post("/conversations/:conversationId/messages", sendMessage);
router.patch("/conversations/:conversationId/read", markConversationRead);

export default router;