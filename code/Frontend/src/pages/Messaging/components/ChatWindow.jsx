import React, { useRef, useEffect, useState } from 'react';
import { Search, MoreVertical, Paperclip, Image as ImageIcon, Mic, Smile, Send } from 'lucide-react';
import MessageBubble from './MessageBubble';

function ChatWindow({ activeContact, messages, onSendMessage }) {
  const scrollRef = useRef();
  const [inputText, setInputText] = useState('');

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!activeContact) {
    return (
      <div className="mc" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)' }}>
        Select a conversation to start messaging
      </div>
    );
  }

  return (
    <div className="mc">
      <div className="mc-header">
        <div className="mc-hinfo">
          <div className="mc-hav" style={{ backgroundColor: activeContact.color }}>
            {activeContact.initials}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="mc-hname">{activeContact.name}</span>
              {activeContact.type === 'org' && <span className="org-badge">Organisation</span>}
            </div>
            <div className={`mc-hstatus ${activeContact.online ? '' : 'away'}`}>
              {activeContact.online ? 'Online' : 'Last seen recently'}
            </div>
          </div>
        </div>
        <div className="mc-hactions">
          <button className="mc-hbtn" title="Search in chat">
            <Search size={18} />
          </button>
          <button className="mc-hbtn" title="More options">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      <div className="mc-body" ref={scrollRef}>
        <div className="day-sep"><span>Today</span></div>
        {messages.map((m, idx) => (
          <MessageBubble 
            key={idx}
            content={m.text}
            time={m.time}
            sentByMe={m.from === 'me'}
            avatarInitial={activeContact.initials}
            avatarColor={activeContact.color}
          />
        ))}
      </div>

      <div className="mc-input-bar">
        <div className="mc-input-actions">
          <button className="mc-act-btn" title="Attach file">
            <Paperclip size={18} />
          </button>
          <button className="mc-act-btn" title="Send image">
            <ImageIcon size={18} />
          </button>
          <button className="mc-act-btn" title="Send voice note">
            <Mic size={18} />
          </button>
        </div>
        <div className="mc-input-row">
          <div className="mc-input-wrap">
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="mc-emoji-btn" title="Emoji">
              <Smile size={18} />
            </button>
          </div>
          <button className="mc-send" onClick={handleSend}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
