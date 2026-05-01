import React, { useState } from 'react';
import { Search } from 'lucide-react';

function ConversationList({ conversations, activeId, onSelect, searchQuery, setSearchQuery }) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredConversations = conversations.filter((c) => {
    const matchTab = activeTab === 'all' || c.type === activeTab;
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="ml">
      <div className="ml-header">
        <div className="ml-title">Messages</div>
        <div className="ml-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="ml-tabs">
        <div 
          className={`ml-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </div>
        <div 
          className={`ml-tab ${activeTab === 'user' ? 'active' : ''}`}
          onClick={() => setActiveTab('user')}
        >
          Users
        </div>
        <div 
          className={`ml-tab ${activeTab === 'org' ? 'active' : ''}`}
          onClick={() => setActiveTab('org')}
        >
          Orgs
        </div>
      </div>
      <div className="ml-list">
        {filteredConversations.map((c) => (
          <div 
            key={c.id} 
            className={`ci ${activeId === c.id ? 'active' : ''}`}
            onClick={() => onSelect(c.id)}
          >
            <div className="ci-av" style={{ backgroundColor: c.color }}>
              {c.initials}
              {c.online && <div className="ci-online"></div>}
            </div>
            <div className="ci-body">
              <div className="ci-top">
                <span className="ci-name">{c.name}</span>
                <span className="ci-time">{c.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                <span className="ci-preview">{c.preview}</span>
                {c.unread > 0 && <span className="ci-badge">{c.unread}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConversationList;
