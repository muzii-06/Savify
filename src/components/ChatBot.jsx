import React, { useState } from 'react';
import './ChatBot.css'; // Custom CSS for styling
import chatbot from './chatbot.png';
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle chatbot visibility
  const toggleChatBot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Chatbot Icon */}
      {!isOpen && (
        <div className="chatbot-icon" onClick={toggleChatBot}>
          <img
            src={chatbot}
            alt="Chatbot"
          />
        </div>
      )}

      {/* Chatbot Interface */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>Chat with us</h3>
            <button className="close-btn" onClick={toggleChatBot}>
              ✖
            </button>
          </div>
          <div className="chatbot-body">
            <div className="message bot-message">
              Hello! I'm Savify. How may I help you today?
            </div>
          </div>
          <div className="chatbot-footer">
            <input
              type="text"
              placeholder="Type a message..."
              disabled
            />
            <button disabled>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
