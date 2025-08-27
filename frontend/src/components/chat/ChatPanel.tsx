import React, { useState, useRef, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';
import { SendHorizonal } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatPanel = () => {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({ role: msg.role, parts: [{text: msg.text}]}));
      const res = await api.post('/ai/chat', { message: input, history });
      const aiMessage: Message = { role: 'model', text: res.data.reply };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = { role: 'model', text: 'Sorry, I encountered an error.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between pb-4 border-b border-border-color">
        <h2 className="text-xl font-semibold">AI Assistant</h2>
        <button onClick={logout} className="text-sm text-accent hover:underline">Logout</button>
      </div>
      <div className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-accent text-white' : 'bg-border-color'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-border-color">
                <p className="text-sm animate-pulse">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="mt-auto">
        <div className="flex items-center space-x-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 p-2 bg-primary border rounded-md resize-none border-border-color focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <button onClick={handleSend} disabled={isLoading} className="p-2 text-white rounded-md bg-accent disabled:bg-gray-500">
            <SendHorizonal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
