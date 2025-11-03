
import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatMessageRole } from '../types';
import GroundingSources from './GroundingSources';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === ChatMessageRole.USER;
  const isError = message.role === ChatMessageRole.ERROR;

  const bubbleClasses = isUser
    ? 'bg-blue-600 text-white self-end'
    : isError
    ? 'bg-red-800 text-red-100 self-start'
    : 'bg-gray-700 text-gray-200 self-start';

  return (
    <div className={`flex flex-col mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`w-auto max-w-xl rounded-lg px-4 py-3 shadow-md ${bubbleClasses}`}>
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
      {message.groundingChunks && message.groundingChunks.length > 0 && (
         <GroundingSources chunks={message.groundingChunks} />
      )}
    </div>
  );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg shadow-lg text-white">
      <div className="flex-1 p-6 overflow-y-auto">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
            <div className="flex items-start mb-4">
                <div className="bg-gray-700 text-gray-200 rounded-lg px-4 py-3 shadow-md flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2 delay-75"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a location-based question..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-full py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
