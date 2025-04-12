import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpIcon, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
};

type UserOption = {
  id: string;
  name: string;
  role: string;
};

const SseChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('user_manager');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Sample user options
  const userOptions: UserOption[] = [
    { id: 'user_manager', name: 'Manager', role: 'Project Manager' },
    { id: 'user_sarah', name: 'Sarah', role: 'Software Engineer' },
    { id: 'user_john', name: 'John', role: 'Frontend Developer' }
  ];

  // Connect to SSE endpoint
  const connectSSE = useCallback(() => {
    // Close existing connection if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setConnectionError(null);
    
    try {
      const eventSource = new EventSource(`http://localhost:8000/chat-stream/${selectedUserId}`);
      eventSourceRef.current = eventSource;
      
      eventSource.onopen = () => {
        console.log('SSE connection opened');
        setIsConnected(true);
      };
      
      eventSource.onmessage = (event) => {
        console.log('SSE message received:', event.data);
        try {
          const data = JSON.parse(event.data);
          
          // Check if this is a connection message
          if (data.type === 'connection') {
            toast({
              title: 'Connected',
              description: data.content,
              duration: 3000,
            });
            return;
          }
          
          setIsAiSpeaking(true);
          
          // Add message from server
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              content: data.content,
              sender: data.sender || 'ai',
              timestamp: new Date()
            }
          ]);
          
          // Stop the speaking animation after a delay
          setTimeout(() => setIsAiSpeaking(false), 1000);
        } catch (e) {
          console.error('Error parsing SSE data:', e);
        }
      };
      
      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        setIsConnected(false);
        setConnectionError('Connection to server lost. Please reconnect.');
        eventSource.close();
      };
      
    } catch (error) {
      console.error('Error creating SSE connection:', error);
      setIsConnected(false);
      setConnectionError(`Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [selectedUserId, toast]);
  
  // Send a message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const messageToSend = newMessage;
    setNewMessage('');
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Show the AI typing indicator immediately
    setIsAiSpeaking(true);
    
    try {
      const response = await fetch(`http://localhost:8000/chat/${selectedUserId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'same-origin',
        body: JSON.stringify({ message: messageToSend })
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        // Stop the typing indicator if there's an error
        setIsAiSpeaking(false);
        
        // Add system message to chat
        const errorMessage: Message = {
          id: Date.now().toString(),
          content: data.message || 'An error occurred',
          sender: 'system',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
        
        // Handle error
        toast({
          title: 'Error',
          description: data.message || 'Failed to send message',
          variant: 'destructive',
          duration: 5000,
        });
      }
    } catch (error) {
      // Stop the typing indicator if there's an error
      setIsAiSpeaking(false);
      
      console.error('Error sending message:', error);
      
      // Add system message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
        sender: 'system',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Error',
        description: 'Failed to send message. Please check your connection.',
        variant: 'destructive',
        duration: 5000,
      });
    }
  };
  
  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Connect to SSE when user changes
  useEffect(() => {
    connectSSE();
    
    // Cleanup on unmount or user change
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [selectedUserId, connectSSE]);
  
  // Handle reconnection
  const handleReconnect = useCallback(() => {
    toast({
      title: 'Reconnecting',
      description: 'Attempting to reconnect to the server...',
      duration: 3000,
    });
    connectSSE();
  }, [connectSSE, toast]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">AI Assistant Chat (SSE Version)</h1>
          <div className="flex items-center">
            <span className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            {!isConnected && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2" 
                onClick={handleReconnect}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Reconnect
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select
            value={selectedUserId}
            onValueChange={(value) => setSelectedUserId(value)}
          >
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {userOptions.map(option => (
                <SelectItem key={option.id} value={option.id} className="hover:bg-gray-700">
                  {option.name} ({option.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Link to="/chat" className="text-sm text-blue-400 hover:text-blue-300">
            Switch to WebSocket Chat
          </Link>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {connectionError && (
          <div className="p-4 mb-4 bg-red-900/50 border border-red-800 rounded-md text-white">
            <p className="font-bold flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Connection Error
            </p>
            <p className="mt-1">{connectionError}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 bg-red-800 hover:bg-red-700 border-red-700"
              onClick={handleReconnect}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Try Again
            </Button>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-xl">No messages yet</p>
            <p className="mt-2">Send a message to start the conversation</p>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-lg max-w-[80%] ${
                message.sender === 'user'
                  ? 'bg-blue-600 ml-auto'
                  : message.sender === 'system'
                  ? 'bg-gray-700'
                  : 'bg-gray-800'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-medium">
                  {message.sender === 'user' ? 'You' : message.sender === 'system' ? 'System' : 'AI Assistant'}
                </span>
                <span className="text-xs text-gray-400">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </motion.div>
          ))
        )}

        {isAiSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-gray-800 max-w-[80%] flex items-center"
          >
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="ml-2 text-sm text-gray-400">AI is typing...</span>
          </motion.div>
        )}

        <div ref={messageEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-end space-x-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 border-gray-700 focus:border-blue-500 resize-none"
            rows={2}
          />
          <Button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!isConnected || !newMessage.trim()}
          >
            <ArrowUpIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .typing-indicator span {
          width: 5px;
          height: 5px;
          background-color: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: bounce 1s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.15s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.3s;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }
      `}</style>
    </div>
  );
};

export default SseChat;
