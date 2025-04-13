// SseChat.tsx (Full Code with Task List Parsing/Rendering)

import React, { useState, useEffect, useRef, useCallback } from 'react';
// Make sure these paths are correct for your project structure
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpIcon, RefreshCw, AlertCircle, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';
// Assuming react-router-dom is installed and configured
import { Link } from 'react-router-dom';

// Interface for parsed task details
interface TaskDetail {
  id: string;
  name: string;
  assignee: string;
  status: string;
  dueDate: string | null;
}

// Updated message type
type Message = {
  id: string;
  content: string; // Can be title for task lists
  sender: 'user' | 'ai' | 'system';
  timestamp: Date;
  type?: 'text' | 'task_list'; // Type to distinguish rendering
  tasks?: TaskDetail[]; // Optional array for task lists
};

// User selection options
type UserOption = {
  id: string;
  name: string;
  role: string;
};

// Helper function to parse task list string from backend
const parseTaskList = (content: string): TaskDetail[] | null => {
    // Check if the content starts with the expected header
    if (!content || !content.trim().startsWith("Here are the")) {
        return null;
    }
    // Split into lines, remove header, filter empty lines
    const lines = content.split('\n').slice(1).filter(line => line.trim() !== '');
    const tasks: TaskDetail[] = [];
    // Regex to capture task details, making Due Date optional
    // Example line: "- ID: task_abc, Name: "Do Thing", Assignee: John, Status: Pending (Due: 2025-12-31)"
    // Or:           "- ID: task_xyz, Name: "Another Thing", Assignee: Sarah, Status: In Progress"
    const taskRegex = /- ID: (.*?), Name: "(.*?)", Assignee: (.*?), Status: (.*?)(?: \(Due: (.*?)\))?$/;

    lines.forEach(line => {
        const match = line.trim().match(taskRegex);
        if (match) {
            // Extract matched groups, providing defaults if null/undefined
            tasks.push({
                id: match[1]?.trim() || 'N/A',
                name: match[2]?.trim() || 'N/A',
                assignee: match[3]?.trim() || 'N/A',
                status: match[4]?.trim() || 'N/A',
                dueDate: match[5]?.trim() || null, // Capture group 5 if it exists
            });
        } else {
            console.warn("Failed to parse task line:", line.trim()); // Log lines that don't match
        }
    });

    // Return tasks only if some were successfully parsed
    return tasks.length > 0 ? tasks : null;
};


const SseChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false); // Controls typing indicator
  const [selectedUserId, setSelectedUserId] = useState('user_manager'); // Default user
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();

  const messageEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Define user options for the dropdown
  const userOptions: UserOption[] = [
    { id: 'user_manager', name: 'Manager', role: 'Project Manager' },
    { id: 'user_sarah', name: 'Sarah', role: 'Software Engineer' },
    { id: 'user_john', name: 'John', role: 'Frontend Developer' }
  ];

  // Function to connect/reconnect to the SSE endpoint
  const connectSSE = useCallback(() => {
    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      console.log('Previous SSE connection closed.');
    }
    eventSourceRef.current = null;

    // Reset state
    setConnectionError(null);
    setIsConnected(false); // Assume disconnected until connection opens
    setMessages([]); // Clear messages for new connection/user

    const sseUrl = `http://localhost:8000/sse/chat-stream/${selectedUserId}`;
    console.log(`Attempting to connect to SSE: ${sseUrl}`);

    try {
      const eventSource = new EventSource(sseUrl);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('SSE connection successfully opened');
        setIsConnected(true);
        setConnectionError(null); // Clear error on successful connection
        // Optionally send a welcome message *from the client* if needed
        // setMessages(prev => [...prev, { id: Date.now().toString(), content: `Connected as ${selectedUserId}`, sender: 'system', timestamp: new Date(), type: 'text' }]);
      };

      eventSource.onmessage = (event) => {
        console.log('SSE raw data received:', event.data);
        try {
          const data = JSON.parse(event.data);

          // Ignore pure heartbeat comments if they arrive here (though they shouldn't)
          if (event.data.startsWith(':')) return;

          // Ignore connection message if already handled or not needed in chat
          if (data.type === 'connection') {
             console.log('SSE connection confirmation message received.');
             return;
          }
          if (data.type === 'heartbeat') {
             console.log('SSE heartbeat message received.');
             return;
          }


          setIsAiSpeaking(true); // Show typing indicator

          // --- PARSE AND ADD MESSAGE ---
          let newMessageData: Message;
          const parsedTasks = parseTaskList(data.content);

          if (parsedTasks) {
            // It's a task list
            newMessageData = {
              id: data.timestamp || Date.now().toString(), // Use server timestamp if available
              content: data.content.split('\n')[0], // Use first line as title
              sender: data.sender || 'ai',
              timestamp: new Date(data.timestamp || Date.now()),
              type: 'task_list',
              tasks: parsedTasks
            };
          } else {
            // It's a normal text message
            newMessageData = {
              id: data.timestamp || Date.now().toString(),
              content: data.content,
              sender: data.sender || 'ai',
              timestamp: new Date(data.timestamp || Date.now()),
              type: 'text'
            };
          }

          setMessages(prev => [...prev, newMessageData]);

          // Hide typing indicator after a short delay
          setTimeout(() => setIsAiSpeaking(false), 500); // Shorter delay maybe

        } catch (e) {
          console.error('Error processing SSE data:', e, "Raw data:", event.data);
          // Add raw data as system message if parsing fails
           setMessages(prev => [...prev, { id: Date.now().toString(), content: `Received unparseable data: ${event.data}`, sender: 'system', timestamp: new Date(), type: 'text' }]);
          setIsAiSpeaking(false);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE connection error occurred:', error);
        setIsConnected(false);
        setConnectionError('Connection error. Server might be down or unreachable. Try reconnecting.');
        // Don't close here immediately, browser might attempt reconnect based on standard
        if (eventSourceRef.current) {
             eventSourceRef.current.close(); // Explicitly close if error seems fatal
             eventSourceRef.current = null;
        }
      };

    } catch (error) {
      console.error('Failed to create SSE EventSource:', error);
      setIsConnected(false);
      setConnectionError(`Failed to initiate connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [selectedUserId]); // Depend only on selectedUserId for initiating connection

  // Function to send message via POST
  const sendMessage = async () => {
    if (!newMessage.trim() || !isConnected) {
        toast({ title: 'Cannot send', description: !isConnected ? 'Not connected.' : 'Message is empty.', variant: 'destructive'});
        return;
    }

    const messageToSend = newMessage;
    setNewMessage(''); // Clear input immediately

    const userMessage: Message = {
      id: Date.now().toString(), // Use temp ID for user message
      content: messageToSend,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, userMessage]); // Display user message optimistically
    setIsAiSpeaking(true); // Assume AI will reply

    try {
      const response = await fetch(`http://localhost:8000/sse/chat/${selectedUserId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        mode: 'cors', // Important for cross-origin requests
        body: JSON.stringify({ message: messageToSend })
      });

      // The actual AI reply will come via the SSE 'onmessage' handler.
      // Here, we just check if the POST was accepted by the server.
      if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `Server returned ${response.status}` }));
          // Display error as system message, SSE handler will turn off indicator
          throw new Error(errorData.detail || errorData.message || `Request failed with status ${response.status}`);
      }

      const data = await response.json(); // Check if backend indicates success
      if (!data.success) {
          // Maybe log a warning, but wait for potential SSE error message
          console.warn('Backend POST response indicated an issue:', data.detail || data.message);
      }
       // Let the SSE handler turn off the speaking indicator when the *actual* reply arrives

    } catch (error) {
      setIsAiSpeaking(false); // Turn off indicator on send error
      console.error('Error sending message:', error);
      const errorMessageContent = `Send Error: ${error instanceof Error ? error.message : 'Failed to send message'}`;
      const errorSysMessage: Message = {
        id: Date.now().toString(),
        content: errorMessageContent,
        sender: 'system',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorSysMessage]); // Show error in chat
      toast({ title: 'Error', description: errorMessageContent, variant: 'destructive' });
    }
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Effect to connect/reconnect when selectedUserId changes
  useEffect(() => {
    connectSSE(); // Connect on initial mount and when user changes

    // Cleanup function to close connection when component unmounts or user changes
    return () => {
      if (eventSourceRef.current) {
        console.log('Closing SSE connection due to component unmount or user change.');
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [selectedUserId, connectSSE]); // Rerun only when user changes

  // Explicit reconnect function for button
  const handleReconnect = useCallback(() => {
    toast({ title: 'Attempting to reconnect...', duration: 2000 });
    connectSSE();
  }, [connectSSE, toast]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between p-3 border-b border-gray-700 shadow-md">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-semibold">AI Assistant (SSE)</h1>
          <div className="flex items-center text-xs text-gray-400">
            <span className={`h-2 w-2 rounded-full mr-1.5 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            {isConnected ? 'Connected' : 'Disconnected'}
            {!isConnected && connectionError && ( // Show reconnect only if disconnected due to error
              <Button variant="ghost" size="sm" className="ml-2 h-6 px-2 text-xs" onClick={handleReconnect}>
                <RefreshCw className="h-3 w-3 mr-1" /> Reconnect
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedUserId} onValueChange={(value) => setSelectedUserId(value)}>
            <SelectTrigger className="w-[190px] h-8 text-xs bg-gray-800 border-gray-600 hover:border-gray-500">
                <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              {userOptions.map(option => (
                <SelectItem key={option.id} value={option.id} className="text-xs hover:bg-gray-700 focus:bg-gray-700">
                  {option.name} <span className="text-gray-400 ml-1">({option.role})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Optional: Link to switch to WebSocket version if you have one */}
          {/* <Link to="/chat-ws" className="text-xs text-blue-400 hover:text-blue-300">Use WebSocket</Link> */}
        </div>
      </header>

      {/* Message Display Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {connectionError && !isConnected && ( // Show detailed error only when disconnected
          <div className="p-3 mb-3 bg-red-900/60 border border-red-700 rounded-md text-red-100 text-xs">
             <p className="font-semibold flex items-center mb-1"><AlertCircle className="h-4 w-4 mr-1.5" /> Connection Error</p>
             <p>{connectionError}</p>
             <Button variant="outline" size="sm" className="mt-2 h-6 px-2 text-xs bg-red-800 hover:bg-red-700 border-red-700" onClick={handleReconnect}>
               <RefreshCw className="h-3 w-3 mr-1" /> Try Reconnect
             </Button>
          </div>
        )}

        {messages.length === 0 && !connectionError ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm">
             <p>No messages yet.</p>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              layout // Animate layout changes smoothly
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`p-3 rounded-lg max-w-[85%] w-fit text-sm shadow-sm ${ // Use w-fit for bubble size
                message.sender === 'user'
                  ? 'bg-blue-600 ml-auto'
                  : message.sender === 'system'
                  ? 'bg-yellow-800/70 border border-yellow-700/50 text-yellow-100 mx-auto text-xs' // System messages centered and styled
                  : 'bg-gray-700 mr-auto' // AI messages align left
              }`}
            >
              {/* Don't show header for system messages maybe */}
              {message.sender !== 'system' && (
                <div className="flex justify-between items-center mb-1 opacity-80">
                  <span className="text-xs font-medium">
                    {message.sender === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                  <span className="text-xs ml-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
              {/* --- CONDITIONAL RENDERING for Task Lists --- */}
              {/* --- START: CONDITIONAL RENDERING (IMPROVED DESIGN) --- */}
              {message.type === 'task_list' && message.tasks ? (
                 <div className="mt-1">
                   {/* Task List Title (optional, using message.content) */}
                   {message.content && (
                       <h4 className="font-semibold text-xs mb-2 flex items-center opacity-90">
                          <ListChecks className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                          {message.content}
                       </h4>
                   )}
                   {/* Task List Items */}
                   <ul className="list-none space-y-2"> {/* Added space between items */}
                     {message.tasks.map((task) => (
                       <li key={task.id} className="p-2.5 bg-black/25 rounded-md border border-gray-600/50 shadow-sm"> {/* Added padding, bg, border */}
                         {/* Task Name and Status Badge */}
                         <div className="flex justify-between items-start mb-1">
                           <span className="font-medium text-gray-100 break-words mr-2">{task.name}</span>
                           <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                               task.status.toLowerCase() === 'pending' ? 'bg-yellow-700/70 text-yellow-100' :
                               task.status.toLowerCase() === 'in progress' ? 'bg-blue-700/70 text-blue-100' :
                               task.status.toLowerCase() === 'completed' ? 'bg-green-700/70 text-green-100' :
                               'bg-gray-500/70 text-gray-100' // Default/Other status
                           }`}>
                             {task.status}
                           </span>
                         </div>
                         {/* Task Metadata */}
                         <div className="text-xs text-gray-400 space-x-2"> {/* Use horizontal space */}
                            <span>ID: {task.id}</span>
                            <span>|</span>
                            <span>Assignee: {task.assignee}</span>
                            {task.dueDate && (
                                <>
                                  <span>|</span>
                                  <span>Due: {task.dueDate}</span>
                                </>
                            )}
                         </div>
                       </li>
                     ))}
                   </ul>
                 </div>
               ) : (
                 // Render normal text content
                 <p className="whitespace-pre-wrap break-words">{message.content}</p>
               )}
              {/* --- END: CONDITIONAL RENDERING --- */}
            </motion.div>
          ))
        )}

        {/* AI Typing Indicator */}
        {isAiSpeaking && (
           <motion.div
             key="typing"
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.2 }}
             className="p-3 rounded-lg bg-gray-700 max-w-[85%] w-fit text-sm shadow-sm mr-auto flex items-center" // Match AI bubble style
           >
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
            <span className="ml-2 text-xs text-gray-400 italic">AI is typing...</span>
           </motion.div>
        )}

        {/* Scroll anchor */}
        <div ref={messageEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-700 bg-gray-900">
        <div className="flex items-end space-x-2 bg-gray-800 rounded-lg border border-gray-700 focus-within:border-blue-500 px-2 py-1.5">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevent newline on Enter
                sendMessage();
              }
            }}
            placeholder={`Chat as ${userOptions.find(u => u.id === selectedUserId)?.name || 'User'}...`}
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-sm placeholder-gray-500 px-1 py-0 no-scrollbar"
            rows={1} // Start with 1 row, auto-expand
            // Add logic for auto-resizing textarea if needed
          />
          <Button
            size="sm"
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white h-8 w-8 p-0" // Smaller button
            disabled={!isConnected || !newMessage.trim()}
            title="Send Message"
          >
            <ArrowUpIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Styles for Typing Indicator */}
      <style jsx>{`
        .typing-indicator { display: flex; align-items: center; gap: 4px; }
        .typing-indicator span {
          width: 6px; height: 6px; background-color: rgba(209, 213, 219, 0.7); /* gray-300 */
          border-radius: 50%; animation: bounce 1.2s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(1) { animation-delay: 0s; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.15s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.0); opacity: 1; }
        }
        /* Simple scrollbar styling for Textarea */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default SseChat;