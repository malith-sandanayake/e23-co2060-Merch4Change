import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import TopNavbar from "../../components/TopNavbar/TopNavbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';
import './MessagingPage.css';

// Mock Data
const INITIAL_CONTACTS = [
  { id: 1, name: 'Sasha Kim', initials: 'SK', type: 'user', online: true, time: 'now', unread: 3, preview: 'Just sent the coins!', color: '#534ab7' },
  { id: 2, name: 'Green Future Org', initials: 'GF', type: 'org', online: true, time: '2m', unread: 1, preview: 'Your donation was confirmed', color: '#0f6e56' },
  { id: 3, name: 'Aiden Silva', initials: 'AS', type: 'user', online: false, time: '14m', unread: 0, preview: 'Thanks for the merch drop', color: '#b74a75' },
  { id: 4, name: 'EcoWear Brand', initials: 'EB', type: 'org', online: true, time: '1h', unread: 0, preview: 'New campaign just launched!', color: '#4ab78f' },
  { id: 5, name: 'Priya Nair', initials: 'PN', type: 'user', online: false, time: '3h', unread: 0, preview: 'Did you see that badge?', color: '#b7834a' },
  { id: 6, name: 'OceanSave Org', initials: 'OS', type: 'org', online: false, time: 'yesterday', unread: 0, preview: 'Thank you for your support', color: '#4a8ab7' },
];

const INITIAL_THREADS = {
  1: [
    { from: 'them', text: 'Hey! Did you check out the new drop from EcoWear?', time: '10:22 AM' },
    { from: 'me', text: 'Yes! I just bought the tote bag. Earned 12 coins from it.', time: '10:23 AM' },
    { from: 'them', text: 'Same! I donated mine to Green Future Org already.', time: '10:24 AM' },
    { from: 'me', text: 'Nice. I am saving up for the OceanSave campaign next week.', time: '10:25 AM' },
    { from: 'them', text: 'Just sent the coins!', time: '10:31 AM' },
  ],
  2: [
    { from: 'them', text: 'Hello! Thank you for your recent donation to our campaign.', time: '9:05 AM' },
    { from: 'me', text: 'Happy to help. What is the current total raised?', time: '9:07 AM' },
    { from: 'them', text: 'We have raised 84% of our goal thanks to supporters like you!', time: '9:08 AM' },
    { from: 'them', text: 'Your donation was confirmed', time: '9:14 AM' },
  ],
  3: [
    { from: 'me', text: 'Hey, loved the last batch of products you posted.', time: 'Yesterday' },
    { from: 'them', text: 'Thanks for the merch drop', time: 'Yesterday' },
  ],
  4: [
    { from: 'them', text: 'New campaign just launched! Check it out on the feed.', time: '11:30 AM' },
  ],
  5: [
    { from: 'them', text: 'Did you see that badge?', time: '8:00 AM' },
    { from: 'me', text: 'Which one?', time: '8:01 AM' },
  ],
  6: [
    { from: 'them', text: 'Thank you for your support', time: 'Yesterday' },
  ],
};

function MessagingPage() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [activeId, setActiveId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [profileData, setProfileData] = useState({
    firstName: "Guest",
    lastName: "User",
    userName: "guest",
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/v1/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.user) {
          setProfileData(data.data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleTabChange = useCallback((tab) => {
    if (tab === "marketplace") {
      navigate("/marketplace");
      return;
    }
    if (tab === "feed") {
      navigate("/home?tab=feed");
    }
  }, [navigate]);

  const handleSelectConversation = (id) => {
    setActiveId(id);
    // Mark as read
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const handleSendMessage = (text) => {
    if (!text.trim()) return;
    
    const newMessage = {
      from: 'me',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setThreads(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), newMessage]
    }));

    // Update conversation preview and time
    setContacts(prev => {
      const updated = prev.map(c => {
        if (c.id === activeId) {
          return { ...c, preview: text, time: 'now' };
        }
        return c;
      });
      // Sort so the updated contact goes to top
      const contactIndex = updated.findIndex(c => c.id === activeId);
      if (contactIndex > 0) {
        const [contact] = updated.splice(contactIndex, 1);
        updated.unshift(contact);
      }
      return updated;
    });

    // Simulate reply after 1 second
    setTimeout(() => {
      const replies = [
        'Got it, thanks!',
        'That is great to hear!',
        'Awesome, will check it out.',
        'Thanks for letting me know.',
        'Cool! See you around the feed.',
      ];
      const replyMessage = {
        from: 'them',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setThreads(prev => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), replyMessage]
      }));

      // Update preview again
      setContacts(prevContacts => prevContacts.map(c => {
        if (c.id === activeId) {
          return { ...c, preview: replyMessage.text, time: 'now' };
        }
        return c;
      }));
    }, 1500);
  };

  const activeContact = contacts.find(c => c.id === activeId);
  const activeMessages = threads[activeId] || [];

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
        <Sidebar
          profileData={profileData}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />

        <main className="lum-main-content messaging-main-content">
          <div className="messaging-page-container">
            <ConversationList 
              conversations={contacts}
              activeId={activeId}
              onSelect={handleSelectConversation}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <ChatWindow 
              activeContact={activeContact}
              messages={activeMessages}
              onSendMessage={handleSendMessage}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MessagingPage;
