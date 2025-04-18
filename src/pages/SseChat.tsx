// SseChat.tsx (Updated with task creation, status updates and suggestions)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpIcon, RefreshCw, AlertCircle, ListChecks, Plus, MessageSquarePlus, ClipboardCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import TaskCreationForm, { TaskFormData } from '../components/TaskCreationForm';
import TaskStatusUpdate from '../components/TaskUpdateForm';
import { format } from 'date-fns';
import { parseContent, parseTaskList, parseTaskUpdate } from './chatUtils';
import ChatMessageList from './components/ChatMessageList';

// Interfaces
interface TaskDetail { 
  id: string; 
  name: string; 
  assignee?: string; // From frontend or backend
  assignee_name?: string; // From backend
  status: string; 
  dueDate?: string | null; 
  priority?: 'low' | 'medium' | 'high';
  description?: string;
}

export type Message = {
  id: string; 
  sender: 'user' | 'ai' | 'system'; 
  timestamp: Date; 
  content?: string;
  type?: 'text' | 'task_list' | 'task_update' | 'task_history' | 'action_request' | 'connection' | 'project_plan_created' | 'task_added_to_plan' | 'task_edited_in_plan' | 'project_plan_finalized';
  tasks?: TaskDetail[];
  task?: TaskDetail; // Single task for updates
  history?: { ts: Date; status: string; by?: string; comment?: string }[];
  suggested_replies?: string[];
  action?: string; 
  prefill?: Partial<TaskFormData>;
  recipient_name?: string;
  context?: string;
  about_user?: string;
  recipient_id?: string;
  requesting_user_id?: string;
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
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskFormInitialData, setTaskFormInitialData] = useState<Partial<TaskFormData>>({});
  const [currentSuggestedReplies, setCurrentSuggestedReplies] = useState<string[]>([]);
  const [isStatusUpdateOpen, setIsStatusUpdateOpen] = useState(false);
  const [currentTaskForUpdate, setCurrentTaskForUpdate] = useState<TaskDetail | null>(null);

  const { toast } = useToast();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

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
    }
    eventSourceRef.current = null;
    setConnectionError(null);
    setIsConnected(false);
    setMessages([]);
    setCurrentSuggestedReplies([]);

    const sseUrl = `http://localhost:8000/sse/chat-stream/${selectedUserId}`;
    console.log(`Attempting SSE: ${sseUrl}`);
    
    try {
      const eventSource = new EventSource(sseUrl);
      eventSourceRef.current = eventSource;
      
      eventSource.onopen = () => {
        console.log('SSE opened');
        setIsConnected(true);
        setConnectionError(null);
      };

      eventSource.onmessage = (event) => {
        console.log('SSE raw data:', event.data);
        setIsAiSpeaking(true);
        setCurrentSuggestedReplies([]); // Clear old suggestions first

        try {
          const data = JSON.parse(event.data);
          const messageId = data.timestamp || Date.now().toString();
          const messageTimestamp = new Date(data.timestamp || Date.now());

          let messageToAdd: Message | null = null;

          // Render notification for connection/system messages
          if (data.type === 'connection' || data.sender === 'system') {
            messageToAdd = {
              id: messageId,
              content: data.content,
              sender: data.sender || 'system',
              timestamp: messageTimestamp,
              type: 'connection',
            };
          }

          // Handle ACTION messages
          else if (data.action === 'show_task_form') {
            console.log("Received action: show_task_form", data.prefill);
            setTaskFormInitialData(data.prefill || {});
            setTimeout(() => setIsTaskFormOpen(true), 100); // Open form
            
            // Add the AI message that triggered the form (optional)
            if (data.content) {
              messageToAdd = {
                id: messageId,
                content: parseContent(data.content),
                sender: data.sender || 'ai',
                timestamp: messageTimestamp,
                type: 'text'
              };
            } else {
              setIsAiSpeaking(false); // No message content, just action
            }
          }
          // Handle CONTENT messages
          else if (data.content) {
            // Prefer backend-structured fields for type, tasks, task
            const contentStr = parseContent(data.content);
            let msgType = data.type || undefined;
            let msgTasks = data.tasks || undefined;
            let msgTask = data.task || undefined;

            if (msgType === 'task_list' && Array.isArray(msgTasks)) {
              // Map backend fields (due_date -> dueDate, assignee_name -> assignee)
              const mappedTasks = msgTasks.map((t: any) => ({
                id: t.id,
                name: t.name,
                assignee_name: t.assignee_name,
                assignee: t.assignee_name,
                status: t.status,
                dueDate: t.due_date,
                priority: t.priority,
                description: t.description
              }));
              messageToAdd = {
                id: messageId,
                content: contentStr.split('\n')[0],
                sender: data.sender || 'ai',
                timestamp: messageTimestamp,
                type: 'task_list',
                tasks: mappedTasks
              };
            } else if (msgType === 'task_update' && msgTask) {
              messageToAdd = {
                id: messageId,
                content: contentStr,
                sender: data.sender || 'ai',
                timestamp: messageTimestamp,
                type: 'task_update',
                task: msgTask
              };
            } else if (msgType === 'task_history' && Array.isArray(data.history)) {
              // Format history timestamps to Date objects and display comments
              const formattedHistory = data.history.map((h: any) => ({
                ts: new Date(h.ts),
                status: h.status,
                by: h.by,
                comment: h.comment
              }));
              messageToAdd = {
                id: messageId,
                sender: data.sender || 'ai',
                timestamp: messageTimestamp,
                type: 'task_history',
                task: data.task || undefined,
                history: formattedHistory
              };
            } else if (msgType === 'project_plan_created') {
              messageToAdd = {
                id: messageId,
                content: contentStr,
                sender: data.sender || 'ai',
                timestamp: messageTimestamp,
                type: 'project_plan_created'
              };
            } else if (msgType === 'task_added_to_plan') {
              messageToAdd = {
                id: messageId,
                content: contentStr,
                sender: data.sender || 'ai',
                timestamp: messageTimestamp,
                type: 'task_added_to_plan'
              };
            } else if (msgType === 'task_edited_in_plan') {
              messageToAdd = {
                id: messageId,
                content: contentStr,
                sender: data.sender || 'ai',
                timestamp: messageTimestamp,
                type: 'task_edited_in_plan'
              };
            } else if (msgType === 'project_plan_finalized') {
              messageToAdd = {
                id: messageId,
                content: contentStr,
                sender: data.sender || 'ai',
                timestamp: messageTimestamp,
                type: 'project_plan_finalized'
              };
            } else {
              // Fallback: try to parse from content if type/tasks/task not present
              const parsedTasks = parseTaskList(contentStr);
              const parsedTaskUpdate = parseTaskUpdate(contentStr);
              if (parsedTasks) {
                messageToAdd = {
                  id: messageId,
                  content: contentStr.split('\n')[0],
                  sender: data.sender || 'ai',
                  timestamp: messageTimestamp,
                  type: 'task_list',
                  tasks: parsedTasks
                };
              } else if (parsedTaskUpdate) {
                messageToAdd = {
                  id: messageId,
                  content: contentStr,
                  sender: data.sender || 'ai',
                  timestamp: messageTimestamp,
                  type: 'task_update',
                  task: parsedTaskUpdate
                };
              } else {
                messageToAdd = {
                  id: messageId,
                  content: contentStr,
                  sender: data.sender || 'ai',
                  timestamp: messageTimestamp,
                  type: 'text'
                };
              }
            }

            // Check for suggestions attached to this content message
            if (data.suggested_replies && Array.isArray(data.suggested_replies)) {
              console.log("Received suggestions:", data.suggested_replies);
              setCurrentSuggestedReplies(data.suggested_replies);
              if (messageToAdd) {
                messageToAdd.suggested_replies = data.suggested_replies;
              }
            }
          }
          // Ignore system/connection messages
          else if (data.sender === 'system') {
            console.log("System message ignored for chat display:", data.content);
            setIsAiSpeaking(false);
          } else {
            console.warn("Received unhandled message structure:", data);
            setIsAiSpeaking(false);
          }

          // Add the message to state if one was created
          if (messageToAdd) {
            setMessages(prev => [...prev, messageToAdd]);
          }

          // Turn off speaking indicator
          if (messageToAdd || data.action) {
            setTimeout(() => setIsAiSpeaking(false), 300);
          } else {
            setIsAiSpeaking(false);
          }
        } catch (e) {
          console.error('SSE processing error:', e);
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              content: `Unparseable: ${event.data}`,
              sender: 'system',
              timestamp: new Date(),
              type: 'text'
            }
          ]);
          setIsAiSpeaking(false);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE error:', error);
        setIsConnected(false);
        setConnectionError('Connection error.');
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
      };
    } catch (error) {
      console.error('SSE init error:', error);
      setIsConnected(false);
      setConnectionError(`Connection failed: ${error instanceof Error ? error.message : 'Unknown'}`);
    }
  }, [selectedUserId]);

  // Send message to backend
  const sendMessage = async (messageText: string) => {
    if (!messageText || !isConnected) {
      toast({ title: 'Cannot send', variant: 'destructive' });
      return;
    }
    
    if (messageText === newMessage.trim()) {
      setNewMessage('');
    }
    
    setCurrentSuggestedReplies([]);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsAiSpeaking(true);
    
    try {
      const response = await fetch(`http://localhost:8000/sse/chat/${selectedUserId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        mode: 'cors',
        body: JSON.stringify({ message: messageText })
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Request failed: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.success) console.warn('Backend POST issue:', data.detail);
    } catch (error) {
      setIsAiSpeaking(false);
      console.error('Send error:', error);
      const errorMsg = `Send Error: ${error instanceof Error ? error.message : 'Unknown'}`;
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          content: errorMsg,
          sender: 'system',
          timestamp: new Date(),
          type: 'text'
        }
      ]);
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
    }
  };

  // Handle sending message from input
  const handleSendClick = () => {
    const msg = newMessage.trim();
    if (msg) sendMessage(msg);
  };

  // Handle suggested reply click
  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  // Handle task form submission
  const handleTaskFormSubmit = async (formData: TaskFormData) => {
    setIsTaskFormOpen(false);
    
    const formattedDate = formData.dueDate ? format(formData.dueDate, 'yyyy-MM-dd') : 'null';
    const priority = formData.priority || 'medium';
    
    const command = `/create_task_form name="${formData.name}" assignee="${formData.assignee}" due="${formattedDate}" priority="${priority}" description="${formData.description || ''}"`;
    await sendMessage(command);
  };

  // Handle manual task form open
  const handleManualTaskFormOpen = () => {
    setTaskFormInitialData({
      assignee: selectedUserId !== 'user_manager' ? selectedUserId : ''
    });
    setIsTaskFormOpen(true);
  };

  // Handle status update click on task
  const handleTaskStatusUpdateClick = (task: TaskDetail) => {
    setCurrentTaskForUpdate(task);
    setIsStatusUpdateOpen(true);
  };

  // Handle request status click on task
  const handleRequestTaskStatusClick = (task: TaskDetail) => {
    const assignee = task.assignee_name || task.assignee || '';
    const taskName = task.name;
    const command = `ask ${assignee} for update on ${taskName}`;
    sendMessage(command);
  };

  // Handle status update submission
  const handleStatusUpdateSubmit = async ({ status, comment }: { status: string; comment: string }) => {
    setIsStatusUpdateOpen(false);
    
    if (!currentTaskForUpdate) return;
    
    const command = `/update_task_status id="${currentTaskForUpdate.id}" status="${status}" comment="${comment}"`;
    await sendMessage(command);
  };

  // Handle proactive status update
  const handleProactiveUpdateTrigger = () => {
    const command = "/send_status_update";
    sendMessage(command);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Connect to SSE when component mounts or user changes
  useEffect(() => {
    connectSSE();
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
    };
  }, [selectedUserId, connectSSE]);

  // Reconnect handler
  const handleReconnect = useCallback(() => {
    toast({ title: 'Reconnecting...', duration: 2000 });
    connectSSE();
  }, [connectSSE, toast]);

  return (
    <div className="relative flex flex-col h-screen bg-gradient-to-br from-[#283048] to-[#859398] text-white font-sans overflow-hidden">
      {/* <div className="absolute inset-0 bg-white/10 backdrop-blur-lg pointer-events-none z-0" /> */}
      {/* Header */}
      <header className="flex items-center justify-between p-3 border-b border-gray-700 shadow-md">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-semibold">AI Assistant (SSE)</h1>
          <div className="flex items-center text-xs text-gray-400">
            <span className={`h-2 w-2 rounded-full mr-1.5 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            {isConnected ? 'Connected' : 'Disconnected'}
            {!isConnected && connectionError && (
              <Button variant="ghost" size="sm" className="ml-2 h-6 px-2 text-xs" onClick={handleReconnect}>
                <RefreshCw className="h-3 w-3 mr-1"/> Reconnect
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger className="w-[190px] h-8 text-xs bg-gray-800 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              {userOptions.map(o => (
                <SelectItem key={o.id} value={o.id} className="text-xs">
                  {o.name} <span className="text-gray-400 ml-1">({o.role})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-xs bg-gray-800 border-gray-600 hover:bg-gray-700"
            onClick={handleManualTaskFormOpen}
            title="Create New Task"
          >
            <Plus className="h-3 w-3 mr-1"/> New Task
          </Button>
          {selectedUserId !== 'user_manager' && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs bg-gray-800 border-gray-600 hover:bg-gray-700"
              onClick={handleProactiveUpdateTrigger}
              title="Send Status Update"
            >
              <MessageSquarePlus className="h-3 w-3 mr-1"/> Status Update
            </Button>
          )}
        </div>
      </header>

      {/* Message Display Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {connectionError && !isConnected && (
          <div className="p-4 mb-4 bg-red-700/30 backdrop-blur-sm border border-red-500 rounded-lg text-red-100 text-sm shadow-lg flex flex-col gap-2 max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="font-semibold">Connection Error</span>
            </div>
            <p className="ml-7 text-red-200">{connectionError}</p>
            <Button
              className="self-start px-4 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-sm hover:from-red-600 hover:to-red-500 transition-all"
              size="sm"
              onClick={handleReconnect}
            >
              Retry
            </Button>
          </div>
        )}
        
        <ChatMessageList
          messages={messages}
          scrollRef={messageEndRef}
          onTaskSelect={handleTaskStatusUpdateClick}
          onRequestStatus={handleRequestTaskStatusClick}
        />
        
        {isAiSpeaking && (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white max-w-[85%] w-fit shadow-md mr-auto flex items-center"
          >
            <div className="typing-indicator flex space-x-1">
              <span className="block w-1 h-1 bg-white/50 rounded-full animate-pulse"></span>
              <span className="block w-1 h-1 bg-white/50 rounded-full animate-pulse delay-150"></span>
              <span className="block w-1 h-1 bg-white/50 rounded-full animate-pulse delay-300"></span>
            </div>
            <span className="ml-2 text-white/70">AI is typing...</span>
          </motion.div>
        )}
        
        <div ref={messageEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-700 bg-gray-900">
        {/* Global Suggested Replies */}
        {currentSuggestedReplies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 animate-in fade-in duration-300">
            <p className="text-xs text-gray-400 w-full mb-1">Quick Replies:</p>
            {currentSuggestedReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(reply)}
                className="h-7 px-2.5 text-xs bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-100 transition-all"
              >
                {reply}
              </Button>
            ))}
          </div>
        )}
        
        {/* Suggestions Row */}
        <div className="flex flex-wrap gap-2 px-4 pt-2 pb-1">
          {[
            "Create a new task",
            "Show my tasks",
            "Show all task list",
            "Update task status",
            "Show task history",
            "Request status update"
          ].map((s, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="text-xs border-gray-600 bg-gray-900 hover:bg-gray-700"
              onClick={() => setNewMessage(s)}
            >
              {s}
            </Button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex items-end gap-2 p-3 border-t border-gray-700 bg-gray-800">
          <Textarea
            className="flex-1 resize-none rounded-lg bg-gray-900 border border-gray-700 text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendClick();
              }
            }}
            placeholder="Type your message..."
          />
          <Button
            className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-r from-[#283048] to-[#859398] shadow-lg hover:from-[#859398] hover:to-[#283048] transition-all"
            onClick={handleSendClick}
            disabled={!newMessage.trim() || !isConnected}
          >
            <ArrowUpIcon className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Status Update Initiator (only shown for employees) */}
        {/* {selectedUserId !== 'user_manager' && (
          <Button
            size="sm"
            variant="secondary"
            className="mt-2 text-xs"
            onClick={handleProactiveUpdateTrigger}
          >
            Send Status Update
          </Button>
        )} */}
      </div>

      {/* Task Creation Form Modal */}
      {isTaskFormOpen && (
        <TaskCreationForm
          isOpen={isTaskFormOpen}
          onClose={() => setIsTaskFormOpen(false)}
          onSubmit={handleTaskFormSubmit}
          initialData={taskFormInitialData}
          userOptions={userOptions}
        />
      )}

      {/* Task Status Update Modal */}
      {isStatusUpdateOpen && currentTaskForUpdate && (
        <TaskStatusUpdate
          isOpen={isStatusUpdateOpen}
          onClose={() => setIsStatusUpdateOpen(false)}
          onSubmit={handleStatusUpdateSubmit}
          taskId={currentTaskForUpdate.id}
          taskName={currentTaskForUpdate.name}
          currentStatus={currentTaskForUpdate.status}
        />
      )}

      {/* Typing Indicator Style */}
      <style jsx>{`
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .typing-indicator span {
          width: 6px;
          height: 6px;
          background-color: rgba(209, 213, 219, .7);
          border-radius: 50%;
          animation: bounce 1.2s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(1) {
          animation-delay: 0s;
        }
        .typing-indicator span:nth-child(2) {
          animation-delay: .15s;
        }
        .typing-indicator span:nth-child(3) {
          animation-delay: .3s;
        }
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(.8);
            opacity: .5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default SseChat;