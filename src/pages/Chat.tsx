import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import ChatDrawer from '@/components/project-board/ChatDrawer';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const userOptions = [
  { id: 'user_manager', name: 'Manager' },
  { id: 'user_sarah', name: 'Sarah' },
  { id: 'user_john', name: 'John' }
];

const Chat: React.FC = () => {
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<string>('user_manager');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  // Track reconnection attempts
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 3;
  
  const connectWebSocket = useCallback(() => {
    // Clear any existing reconnect timeouts
    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // If we've exceeded max reconnect attempts, don't try again automatically
    if (reconnectAttempts >= maxReconnectAttempts) {
      setIsConnecting(false);
      setConnectionError(`Failed to connect after ${maxReconnectAttempts} attempts. Click 'Reconnect' to try again.`);
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    try {
      const ws = new WebSocket(`ws://localhost:8000/ws/${selectedUserId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log(`Connected to WebSocket as ${selectedUserId}`);
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionError(null);
        setReconnectAttempts(0); // Reset reconnect attempts on successful connection
        
        // Add system message about connection
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            content: `Connected as ${userOptions.find(u => u.id === selectedUserId)?.name || selectedUserId}`,
            sender: 'ai',
            timestamp: new Date()
          }
        ]);

        toast({
          title: 'Connected',
          description: `Connected as ${userOptions.find(u => u.id === selectedUserId)?.name}`,
          duration: 3000,
        });
      };

      ws.onmessage = (event) => {
        console.log('Message received:', event.data);
        setIsAiSpeaking(true);
        
        // Add message from server
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            content: event.data,
            sender: 'ai',
            timestamp: new Date()
          }
        ]);
        
        // Stop the speaking animation after a delay
        setTimeout(() => setIsAiSpeaking(false), 1000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionError('Failed to connect to the server. The backend may not be running.');
        
        // Increment reconnect attempts
        setReconnectAttempts(prev => prev + 1);
        
        // Only schedule reconnect if we haven't exceeded max attempts
        if (reconnectAttempts < maxReconnectAttempts) {
          // Use exponential backoff for retry delays (3s, 6s, 12s)
          const delay = 3000 * Math.pow(2, reconnectAttempts);
          
          reconnectTimeoutRef.current = window.setTimeout(() => {
            if (!isConnected && !isConnecting) {
              connectWebSocket();
            }
          }, delay);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed', event);
        setIsConnected(false);
        setIsConnecting(false);
        
        if (!event.wasClean) {
          setConnectionError('Connection closed unexpectedly.');
          
          // Add system message about disconnection
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              content: 'Connection lost.',
              sender: 'ai',
              timestamp: new Date()
            }
          ]);
          
          // Increment reconnect attempts
          setReconnectAttempts(prev => prev + 1);
          
          // Only schedule reconnect if we haven't exceeded max attempts
          if (reconnectAttempts < maxReconnectAttempts) {
            // Use exponential backoff for retry delays
            const delay = 3000 * Math.pow(2, reconnectAttempts);
            
            reconnectTimeoutRef.current = window.setTimeout(() => {
              if (!isConnected && !isConnecting) {
                connectWebSocket();
              }
            }, delay);
          }
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setIsConnected(false);
      setIsConnecting(false);
      setConnectionError(`Failed to create WebSocket connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setReconnectAttempts(prev => prev + 1);
    }
  }, [selectedUserId, isConnected, isConnecting, toast, reconnectAttempts]);

  // Connect to WebSocket when user changes
  useEffect(() => {
    connectWebSocket();
    
    // Clean up on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [selectedUserId, connectWebSocket]);

  const sendMessage = useCallback((message: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      toast({
        title: 'Connection Error',
        description: 'Not connected to the server. Please wait for reconnection or try refreshing.',
        variant: 'destructive',
      });
      return;
    }

    // Add user message to the chat
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        content: message,
        sender: 'user',
        timestamp: new Date()
      }
    ]);

    // Send the message through WebSocket
    try {
      wsRef.current.send(message);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Failed to send message',
        description: 'There was an error sending your message. Please try again.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    // Clear messages when switching users
    setMessages([]);
  };

  return (
    <section className="min-h-screen py-12 bg-gradient-to-br from-[#283048] to-[#859398] relative overflow-hidden">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg pointer-events-none"></div>
      <div className="container mx-auto p-4 h-screen flex flex-col relative z-10">
        <Card className="bg-white/20 backdrop-blur-lg border-white/20 text-white shadow-lg mb-4">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>AI Chat Demo</span>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <Select value={selectedUserId} onValueChange={handleUserChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select User" />
                  </SelectTrigger>
                  <SelectContent>
                    {userOptions.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500' : 'bg-red-500'}`} />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              This demo showcases the AI chat functionality. Select a user from the dropdown to switch between roles.
            </p>
            
            {connectionError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {connectionError}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          {!isConnected && (
            <CardFooter>
              <Button 
                onClick={connectWebSocket} 
                disabled={isConnecting}
                className="px-6 py-2 bg-gradient-to-r from-[#283048] to-[#859398] text-white rounded-full shadow-lg hover:from-[#859398] hover:to-[#283048] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isConnecting ? 'animate-spin' : ''}`} />
                {isConnecting ? 'Connecting...' : 'Reconnect'}
              </Button>
            </CardFooter>
          )}
        </Card>

        <ChatDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          messages={messages}
          onSendMessage={sendMessage}
          isAiSpeaking={isAiSpeaking}
        />

        {!isDrawerOpen && (
          <Button 
            className="fixed bottom-4 right-4 bg-gradient-to-r from-[#283048] to-[#859398] text-white rounded-full shadow-lg p-3 hover:from-[#859398] hover:to-[#283048] transition-all"
            onClick={() => setIsDrawerOpen(true)}
          >
            Open Chat
          </Button>
        )}
      </div>
    </section>
  );
};

export default Chat;
