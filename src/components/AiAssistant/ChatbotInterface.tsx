
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send, X, Minimize, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { processUserMessage } from './aiEngine';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const ChatbotInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your crypto assistant. Ask me about cryptocurrencies, market trends, or how to use this app.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage = {
      role: 'user' as const,
      content: inputValue,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Process the message with our local AI engine
      const response = await processUserMessage(userMessage.content);
      
      // Add assistant response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chatbot Button */}
      {!isOpen && (
        <Button 
          onClick={toggleChatbot} 
          className="rounded-full h-14 w-14 flex items-center justify-center bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <MessageCircle size={24} />
        </Button>
      )}
      
      {/* Chatbot Panel */}
      {isOpen && (
        <div className="flex flex-col bg-crypto-dark border border-gray-800 rounded-lg shadow-xl w-80 sm:w-96">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-800">
            <CardTitle className="text-lg">Crypto Assistant</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleMinimize} className="h-8 w-8 p-0">
                {isMinimized ? <Maximize size={16} /> : <Minimize size={16} />}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleChatbot} className="h-8 w-8 p-0">
                <X size={16} />
              </Button>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className={cn("flex-1", isMinimized ? "hidden" : "block")}>
            <div className="p-4 h-80 overflow-y-auto bg-gray-900">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}
                >
                  <div 
                    className={`inline-block p-3 rounded-lg max-w-[90%] ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-800 text-white rounded-bl-none'
                    }`}
                  >
                    {message.content}
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex p-3 border-t border-gray-800">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1 bg-gray-800 border-gray-700"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !inputValue.trim()} 
                className="ml-2"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotInterface;
