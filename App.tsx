import React, { useState, useEffect } from 'react';
import { Message, ChatMessageRole, Location } from './types';
import { getChatResponse } from './services/geminiService';
import { useGeolocation } from './hooks/useGeolocation';
import MapView from './components/MapView';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { location, error: locationError, loading: locationLoading, refetchLocation } = useGeolocation();

  useEffect(() => {
    setMessages([
      {
        id: 'init',
        role: ChatMessageRole.MODEL,
        content: "Hello! I'm GeoChat AI. I can answer questions using real-time information from Google Search and Maps. What would you like to know?",
      },
    ]);
  }, []);

  const handleSendMessage = async (input: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: ChatMessageRole.USER,
      content: input,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { text, groundingChunks } = await getChatResponse(input, location);
      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: ChatMessageRole.MODEL,
        content: text,
        groundingChunks: groundingChunks,
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: ChatMessageRole.ERROR,
        content: error instanceof Error ? error.message : "An unknown error occurred.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white p-4 gap-4">
      <header className="absolute top-4 left-4 flex items-center z-10">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.5-11.25a.75.75 0 01.75.75v14.25a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 110-18 9 9 0 010 18z" />
        </svg>
        <h1 className="text-2xl font-bold ml-2 text-gray-200">GeoChat AI</h1>
      </header>
      
      <main className="flex flex-col md:flex-row w-full h-full pt-12 md:pt-0 gap-4">
        <div className="md:w-1/2 lg:w-2/5 h-1/3 md:h-full">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
        <div className="md:w-1/2 lg:w-3/5 h-2/3 md:h-full">
          <MapView 
            location={location} 
            loading={locationLoading} 
            error={locationError} 
            onRefetch={refetchLocation} 
          />
        </div>
      </main>
    </div>
  );
};

export default App;
