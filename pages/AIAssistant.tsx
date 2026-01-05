import React, { useState, useRef, useEffect } from 'react';
import { generateAIResponse, setApiKey } from '../services/geminiService';
import { Send, Bot, User, AlertTriangle } from 'lucide-react';
import { ChatMessage } from '../types';

export const AIAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', content: 'Hi! I am your Store Manager AI. Ask me about SOPs, product locations, or how to handle specific tasks.', timestamp: new Date() }
  ]);
  const [loading, setLoading] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Convert history to Gemini format
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const responseText = await generateAIResponse(userMsg.content, history);
      
      const botMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        content: responseText || "I couldn't generate a response.", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, botMsg]);
      setApiKeyMissing(false);
    } catch (err: any) {
      if (err.message === 'API_KEY_MISSING') {
        setApiKeyMissing(true);
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', content: 'Error connecting to AI service.', timestamp: new Date() }]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Bot className="text-monday-primary" /> Manager Bot
          </h2>
          <p className="text-xs text-gray-500">Powered by Gemini 3 Flash</p>
        </div>
        {apiKeyMissing && (
             <button 
                onClick={() => {
                    const key = prompt("Please enter a valid Google Gemini API Key to test the AI:");
                    if(key) { setApiKey(key); setApiKeyMissing(false); }
                }}
                className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded flex items-center gap-1 hover:bg-red-200"
             >
                <AlertTriangle size={12} /> Set API Key
             </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-monday-primary text-white rounded-tr-none' 
                : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
            }`}>
              <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-gray-50 text-gray-500 rounded-lg p-3 text-sm italic">
                Thinking...
             </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-monday-primary"
            placeholder="Ask about SOPs (e.g., 'How to stock spirits?')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-monday-primary text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};
