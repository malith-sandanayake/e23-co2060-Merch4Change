import React from 'react';
import { CheckCheck } from 'lucide-react';

function MessageBubble({ content, time, sentByMe, avatarInitial, avatarColor }) {
  return (
    <div className={`msg-row ${sentByMe ? 'mine' : ''}`}>
      {!sentByMe && (
        <div className="msg-av" style={{ backgroundColor: avatarColor || '#555' }}>
          {avatarInitial}
        </div>
      )}
      <div className="msg-col">
        <div className="msg-bubble">{content}</div>
        <div className="msg-meta">
          <span>{time}</span>
          {sentByMe && (
            <span className="read-tick">
              <CheckCheck size={14} />
            </span>
          )}
        </div>
      </div>
      {sentByMe && (
        <div className="msg-av" style={{ backgroundColor: '#4a24e1' }}>
          ME
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
