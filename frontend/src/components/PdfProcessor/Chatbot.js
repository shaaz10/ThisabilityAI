import React, { useState, useCallback } from 'react';
import { FaRobot } from 'react-icons/fa6';
import { IoMdSend } from "react-icons/io";
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [extractedText, setExtractedText] = useState(''); // Assuming extracted text is in state
  const [loading, setLoading] = useState(false); // State for showing loader

  // Handle input change for user query
  const handleInputChange = useCallback((event) => {
    setUserInput(event.target.value);
  }, []);

  // Handle submit query (sending to Flask backend and getting Gemini API response)
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Add user input to chat history
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { type: 'user', message: userInput },
    ]);

    setLoading(true); // Show loader
    try {
      // Send the user input and extracted text to Flask backend for processing with Gemini API
      const response = await axios.post('http://localhost:5000/chatbot', {
        user_query: userInput,
        extracted_text: extractedText,
      });

      // Get response from backend (Gemini API response)
      const chatbotResponse = response.data.answer || "Sorry, I couldn't generate a response.";
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { type: 'bot', message: chatbotResponse },
      ]);
    } catch (error) {
      console.error('Error fetching response from backend:', error);
    } finally {
      setLoading(false); // Hide loader
    }

    setUserInput(''); // Clear input after sending
  };

  // Toggle the chat window open/close
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Close the chat window
  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {/* Floating Button */}
      <div 
        className={`floating-btn ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
      >
        <FaRobot size={30} />
        <span>Chat with Bot</span>
      </div>

      {/* Chat Interface */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h5>Chatbot</h5>
            <button className="close-btn" onClick={closeChat}>×</button>
          </div>

          <div className="chat-history" style={{ height: '300px', overflowY: 'auto' }}>
            {/* Chat History */}
            {chatHistory.map((entry, index) => (
              <div
                key={index}
                className={entry.type === 'user' ? 'user-message' : 'bot-message'}
                style={{
                  textAlign: entry.type === 'user' ? 'right' : 'left',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '10px',
                  backgroundColor: entry.type === 'user' ? '#007bff' : '#e2e2e2',
                  color: entry.type === 'user' ? 'white' : 'black',
                  animation: 'fadeIn 0.5s',
                }}
              >
                {entry.message}
              </div>
            ))}
            {/* Loader */}
            {loading && (
              <div className="loader">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="d-flex">
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                placeholder="Ask a question..."
                className="form-control m-1 rounded-3  "
              />
              <button type="submit" className="btn rounded-3 ">
              <IoMdSend className='fs-3' />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
