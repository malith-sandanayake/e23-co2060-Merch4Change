import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavbar from "../../components/TopNavbar/TopNavbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import ConversationList from "./components/ConversationList";
import ChatWindow from "./components/ChatWindow";
import {
  createMessagingConversation,
  getConversationThread,
  getMessagingContacts,
  markConversationRead,
  sendConversationMessage,
} from "../../api/messagesService";
import "./MessagingPage.css";

function MessagingPage() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeContactId, setActiveContactId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileData, setProfileData] = useState({
    firstName: "Guest",
    lastName: "User",
    userName: "guest",
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isThreadLoading, setIsThreadLoading] = useState(false);
  const [error, setError] = useState("");

  const activeContact = useMemo(() => {
    return contacts.find((contact) => contact.id === activeContactId) || null;
  }, [contacts, activeContactId]);

  const upsertContact = useCallback((nextContact) => {
    setContacts((currentContacts) => {
      const remainingContacts = currentContacts.filter((contact) => contact.id !== nextContact.id);
      return [nextContact, ...remainingContacts];
    });
  }, []);

  const loadContacts = useCallback(async (preserveSelection = true) => {
    const response = await getMessagingContacts();
    const nextContacts = response.data?.contacts || [];

    setContacts(nextContacts);

    setActiveContactId((currentId) => {
      if (preserveSelection && currentId && nextContacts.some((contact) => contact.id === currentId)) {
        return currentId;
      }

      return nextContacts[0]?.id || null;
    });

    return nextContacts;
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
          const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
          const profileResponse = await fetch(`${apiUrl}/api/v1/profile/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const profilePayload = await profileResponse.json();
          if (profilePayload.success && profilePayload.data?.user) {
            setProfileData(profilePayload.data.user);
          }
        }

        await loadContacts(false);
      } catch {
        setError("Unable to load messaging data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [loadContacts]);

  useEffect(() => {
    if (!activeContact) {
      setMessages([]);
      return;
    }

    if (!activeContact.conversationId) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    const loadThread = async () => {
      setIsThreadLoading(true);
      setError("");

      try {
        const response = await getConversationThread(activeContact.conversationId);
        if (cancelled) {
          return;
        }

        setMessages(response.data?.messages || []);
        markConversationRead(activeContact.conversationId).catch(() => {});
      } catch {
        if (!cancelled) {
          setError("Unable to load conversation.");
        }
      } finally {
        if (!cancelled) {
          setIsThreadLoading(false);
        }
      }
    };

    loadThread();

    return () => {
      cancelled = true;
    };
  }, [activeContact]);

  const handleTabChange = useCallback(
    (tab) => {
      if (tab === "marketplace") {
        navigate("/marketplace");
        return;
      }

      if (tab === "discover" || tab === "trends") {
        navigate("/home?tab=discover");
        return;
      }

      if (tab === "feed") {
        navigate("/home?tab=feed");
      }
    },
    [navigate],
  );

  const handleDiscoverClick = useCallback(() => {
    navigate("/home?tab=discover");
  }, [navigate]);

  const handleSelectConversation = useCallback((id) => {
    setActiveContactId(id);
  }, []);

  const handleSendMessage = useCallback(
    async (text) => {
      const messageBody = String(text || "").trim();
      if (!messageBody || !activeContact) {
        return;
      }

      setError("");

      try {
        let conversationId = activeContact.conversationId;
        const contactSnapshot = activeContact;

        if (!conversationId) {
          const createdResponse = await createMessagingConversation(activeContact.id);
          const createdConversation = createdResponse.data?.conversation || null;

          if (createdConversation?.id) {
            conversationId = createdConversation.id;
          }
        }

        if (!conversationId) {
          throw new Error("Conversation could not be created.");
        }

        const response = await sendConversationMessage(conversationId, messageBody);
        const sentMessage = response.data?.message;

        if (sentMessage) {
          setMessages((currentMessages) => [...currentMessages, sentMessage]);
        }

        const nextContact = {
          ...contactSnapshot,
          conversationId,
          preview: messageBody,
          time: "now",
          unread: 0,
        };
        upsertContact(nextContact);
        setActiveContactId(nextContact.id);
      } catch {
        setError("Unable to send message.");
      }
    },
    [activeContact, upsertContact],
  );

  return (
    <div className={`luminous-app ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <TopNavbar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        profileData={profileData}
        activeTab="messages"
        onTabChange={handleTabChange}
      />

      <div className="lum-layout">
        <Sidebar profileData={profileData} setIsSidebarCollapsed={setIsSidebarCollapsed} />

        <main className="lum-main-content messaging-main-content">
          {isLoading ? (
            <div className="up-loading">
              <p>Loading messages…</p>
            </div>
          ) : error && contacts.length === 0 ? (
            <div className="up-loading">
              <p>{error}</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="messaging-page-container messaging-empty-state-shell">
              <div className="messaging-empty-state">
                <div className="messaging-empty-kicker">Messages</div>
                <h2>Find people to start messaging</h2>
                <p>
                  Once you have a conversation, it will appear here. Use Discover to find people and brands to
                  connect with.
                </p>
                <button type="button" className="messaging-empty-button" onClick={handleDiscoverClick}>
                  Go to Discover
                </button>
              </div>
            </div>
          ) : (
            <div className="messaging-page-container">
              <ConversationList
                conversations={contacts}
                activeId={activeContactId}
                onSelect={handleSelectConversation}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {error && <div className="up-loading" style={{ minHeight: 0 }}><p>{error}</p></div>}
                {isThreadLoading ? (
                  <div className="up-loading" style={{ flex: 1 }}>
                    <p>Loading conversation…</p>
                  </div>
                ) : (
                  <ChatWindow
                    activeContact={activeContact}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                  />
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default MessagingPage;
