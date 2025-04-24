import React, { useState } from 'react';
import './ChatBot.css';
import chatbot from './chatbot.png';
import axios from 'axios';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hi! I'm Savify 🤖. Ask me anything about orders, shipping, returns, or products." }
  ]);
  const [input, setInput] = useState('');

  const toggleChatBot = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post('http://localhost:5000/api/chatbot', { message: input });
      const botMsg = { sender: 'bot', text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("❌ Chatbot error:", err);
      const botError = { sender: 'bot', text: "Sorry, I couldn't process that. Please try again." };
      setMessages((prev) => [...prev, botError]);
    }

    setInput('');
  };

  return (
    <div>
      {!isOpen && (
        <div className="chatbot-icon" onClick={toggleChatBot}>
          <img src={chatbot} alt="Chatbot" />
        </div>
      )}

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>Chat with Savify</h3>
            <button className="close-btn" onClick={toggleChatBot}>✖</button>
          </div>

          <div className="chatbot-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-footer">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your question..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
