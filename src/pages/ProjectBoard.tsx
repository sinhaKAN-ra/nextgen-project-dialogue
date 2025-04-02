import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult, DragUpdate } from "react-beautiful-dnd";
import { Calendar, Clock, Plus, Edit, Trash2, MessageCircle, Filter, Search, Send, ChevronRight, Zap, BarChart3, MoreVertical, Calendar as CalendarIcon, XCircle, Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task, Column } from "@/types/task";
import TaskCard from "@/components/TaskCard";
import BoardView from "@/components/BoardView";
import TimelineView from "@/components/TimelineView";

// Types
// export interface Task {
//   id: string;
//   title: string;
//   description: string;
//   deadline: string;
//   priority: "low" | "medium" | "high";
//   assignee: {
//     name: string;
//     avatar?: string;
//   };
//   comments: number;
//   progress: number;
// }

// interface Column {
//   id: string;
//   title: string;
//   taskIds: string[];
// }

export interface BoardData {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

const initialData: BoardData = {
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Create project requirements doc",
      description: "Document all functional and non-functional requirements",
      deadline: "2023-06-15",
      priority: "high",
      assignee: {
        name: "Alex Chen",
        avatar: undefined,
      },
      comments: 3,
      progress: 20,
    },
    "task-2": {
      id: "task-2",
      title: "Design user interface",
      description: "Create wireframes and mockups for the main screens",
      deadline: "2023-06-20",
      priority: "medium",
      assignee: {
        name: "Maya Lin",
        avatar: undefined,
      },
      comments: 5,
      progress: 65,
    },
    "task-3": {
      id: "task-3",
      title: "Implement authentication",
      description: "Add user login and registration functionality",
      deadline: "2023-06-25",
      priority: "high",
      assignee: {
        name: "Sam Park",
        avatar: undefined,
      },
      comments: 2,
      progress: 45,
    },
    "task-4": {
      id: "task-4",
      title: "Create database schema",
      description: "Design and implement the database structure",
      deadline: "2023-06-18",
      priority: "medium",
      assignee: {
        name: "Jordan Taylor",
        avatar: undefined,
      },
      comments: 1,
      progress: 80,
    },
    "task-5": {
      id: "task-5",
      title: "Write API documentation",
      description: "Document all API endpoints and parameters",
      deadline: "2023-06-30",
      priority: "low",
      assignee: {
        name: "Avery Johnson",
        avatar: undefined,
      },
      comments: 0,
      progress: 10,
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To Do",
      taskIds: ["task-1", "task-5"],
    },
    "column-2": {
      id: "column-2",
      title: "In Progress",
      taskIds: ["task-2", "task-3"],
    },
    "column-3": {
      id: "column-3",
      title: "Review",
      taskIds: ["task-4"],
    },
    "column-4": {
      id: "column-4",
      title: "Done",
      taskIds: [],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3", "column-4"],
};

const initialChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "ai",
    text: "Hello! I'm PMAI, your Project Management AI assistant. How can I help with your tasks today?",
    timestamp: new Date(Date.now() - 60000),
  },
];

const ProjectBoard: React.FC = () => {
  const [boardData, setBoardData] = useState<BoardData>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTimelineView, setIsTimelineView] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [showAiTaskForm, setShowAiTaskForm] = useState(false);
  const [aiTaskData, setAiTaskData] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    deadline: ""
  });
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [taskFilter, setTaskFilter] = useState<"all" | "today" | "thisWeek" | "thisMonth" | "overdue" | "future">("all");
  const [viewMode, setViewMode] = useState("board");

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      document.body.style.cursor = 'default';
      return;
    }

    const sourceColumn = boardData.columns[source.droppableId];
    const destColumn = boardData.columns[destination.droppableId];

    // If moving within the same column
    if (sourceColumn === destColumn) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      };

      setBoardData({
        ...boardData,
        columns: {
          ...boardData.columns,
          [newColumn.id]: newColumn,
        },
      });
    } else {
      // Moving from one column to another
      const sourceTaskIds = Array.from(sourceColumn.taskIds);
      sourceTaskIds.splice(source.index, 1);

      const destinationTaskIds = Array.from(destColumn.taskIds);
      destinationTaskIds.splice(destination.index, 0, draggableId);

      setBoardData({
        ...boardData,
        columns: {
          ...boardData.columns,
          [sourceColumn.id]: {
            ...sourceColumn,
            taskIds: sourceTaskIds,
          },
          [destColumn.id]: {
            ...destColumn,
            taskIds: destinationTaskIds,
          },
        },
      });
    }

    document.body.style.cursor = 'default';
  };

  const addNewTask = (title = newTaskTitle, description = newTaskDescription, deadline = newTaskDeadline, priority = newTaskPriority) => {
    if (title.trim() === "") return;

    // Create new task
    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = {
      id: newTaskId,
      title,
      description,
      deadline: deadline || format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      priority,
      assignee: {
        name: "Unassigned",
      },
      comments: 0,
      progress: 0,
    };

    // Add to first column
    const firstColumnId = boardData.columnOrder[0];
    const firstColumn = boardData.columns[firstColumnId];

    setBoardData({
      ...boardData,
      tasks: {
        ...boardData.tasks,
        [newTaskId]: newTask,
      },
      columns: {
        ...boardData.columns,
        [firstColumnId]: {
          ...firstColumn,
          taskIds: [...firstColumn.taskIds, newTaskId],
        },
      },
    });

    // Reset form
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskDeadline("");
    setNewTaskPriority("medium");
    setSelectedDate(undefined);
    setAiTaskData({
      title: "",
      description: "",
      priority: "medium",
      deadline: ""
    });
    setShowAiTaskForm(false);

    // Add AI response about the new task
    const aiResponse: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "ai",
      text: `Great! I've added "${title}" to your To Do list. Need help getting started with this task?`,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, aiResponse]);
    simulateAiSpeaking();
  };

  const deleteTask = (taskId: string) => {
    // Find which column contains the task
    let columnId = "";
    for (const [colId, column] of Object.entries(boardData.columns)) {
      if (column.taskIds.includes(taskId)) {
        columnId = colId;
        break;
      }
    }

    if (!columnId) return;

    // Create a copy of the column and remove the task
    const column = boardData.columns[columnId];
    const newTaskIds = column.taskIds.filter(id => id !== taskId);

    // Create a copy of the tasks object without the deleted task
    const { [taskId]: _, ...remainingTasks } = boardData.tasks;

    // Update the state
    setBoardData({
      ...boardData,
      tasks: remainingTasks,
      columns: {
        ...boardData.columns,
        [columnId]: {
          ...column,
          taskIds: newTaskIds,
        },
      },
    });

    // Add AI response about the deleted task
    const aiResponse: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "ai",
      text: `I've deleted the task as requested. Is there anything else you need?`,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, aiResponse]);
    simulateAiSpeaking();
  };

  const updateTaskProgress = (taskId: string, progress: number) => {
    setBoardData({
      ...boardData,
      tasks: {
        ...boardData.tasks,
        [taskId]: {
          ...boardData.tasks[taskId],
          progress,
        },
      },
    });
  };

  const simulateAiSpeaking = () => {
    setIsAiSpeaking(true);
    setTimeout(() => {
      setIsAiSpeaking(false);
    }, 5000);
  };

  const handleAiTaskSubmit = () => {
    addNewTask(aiTaskData.title, aiTaskData.description, aiTaskData.deadline, aiTaskData.priority);
  };

  const sendMessage = () => {
    if (currentMessage.trim() === "") return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: currentMessage,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");

    // Process user message and generate AI response
    setTimeout(() => {
      let aiResponse: ChatMessage;

      // Check if message contains certain keywords
      const lowerMessage = currentMessage.toLowerCase();

      if (lowerMessage.includes("add task") || lowerMessage.includes("create task")) {
        // Show task creation form
        setShowAiTaskForm(true);

        aiResponse = {
          id: `msg-${Date.now()}`,
          sender: "ai",
          text: "I'd be happy to help you create a task. Please fill out the form I've opened for you.",
          timestamp: new Date(),
        };
      } else if (lowerMessage.includes("delete") && lowerMessage.includes("task")) {
        // Find task by title (simplified approach)
        const taskTitle = Object.values(boardData.tasks)
          .find(task => lowerMessage.toLowerCase().includes(task.title.toLowerCase()))?.title;

        if (taskTitle) {
          const taskId = Object.entries(boardData.tasks)
            .find(([_, task]) => task.title === taskTitle)?.[0];

          if (taskId) {
            deleteTask(taskId);
            return;
          }
        }

        aiResponse = {
          id: `msg-${Date.now()}`,
          sender: "ai",
          text: "I couldn't find that task. Could you specify which task you want to delete?",
          timestamp: new Date(),
        };
      } else {
        aiResponse = {
          id: `msg-${Date.now()}`,
          sender: "ai",
          text: "I'm PMAI, here to help manage your tasks. You can ask me to add or delete tasks, or get updates on your project progress.",
          timestamp: new Date(),
        };
      }

      setChatMessages(prev => [...prev, aiResponse]);
      simulateAiSpeaking();
    }, 1000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/10 text-red-600 hover:bg-red-500/20";
      case "medium": return "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20";
      case "low": return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
      default: return "bg-slate-500/10 text-slate-600 hover:bg-slate-500/20";
    }
  };

  const getTimelinePosition = (deadline: string) => {
    const today = new Date();
    const taskDate = new Date(deadline);
    const timelineDuration = 30; // 30 days timeline

    // Calculate if the task is overdue, due soon, or in the future
    if (taskDate < today) {
      return {
        status: "overdue",
        daysFromNow: Math.ceil(Math.abs(today.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24)),
        color: "bg-red-500",
        left: "0%"
      };
    }

    const diffTime = Math.abs(taskDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > timelineDuration) {
      return {
        status: "future",
        daysFromNow: diffDays,
        color: "bg-indigo-500",
        left: "95%"
      };
    } else if (diffDays < 7) {
      return {
        status: "soon",
        daysFromNow: diffDays,
        color: "bg-amber-500",
        left: `${(diffDays / timelineDuration) * 100}%`
      };
    } else {
      return {
        status: "upcoming",
        daysFromNow: diffDays,
        color: "bg-green-500",
        left: `${(diffDays / timelineDuration) * 100}%`
      };
    }
  };

  const filteredTasks = searchTerm.trim() === ""
    ? boardData.tasks
    : Object.fromEntries(
      Object.entries(boardData.tasks).filter(([_, task]) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="relative">
        <Header />
        <div className="container mx-auto p-4 pt-20">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Project Board</h1>
            <div className="flex items-center gap-4">
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="View mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="board">Board</SelectItem>
                  <SelectItem value="timeline">Timeline</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setIsChatOpen(true)} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Zap className="h-4 w-4 mr-2" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  Pmai
                </span> 
              </Button>
            </div>
          </div>

          {viewMode === "board" ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <BoardView
                columnOrder={boardData.columnOrder}
                columns={boardData.columns}
                tasks={boardData.tasks}
                filteredTasks={filteredTasks}
                isAiSpeaking={isAiSpeaking}
                onUpdateProgress={updateTaskProgress}
                onDeleteTask={deleteTask}
              />
            </DragDropContext>
          ) : (
            <TimelineView
              columnOrder={boardData.columnOrder}
              columns={boardData.columns}
              tasks={boardData.tasks}
              filteredTasks={filteredTasks}
              isAiSpeaking={isAiSpeaking}
              onUpdateProgress={updateTaskProgress}
              onDeleteTask={deleteTask}
              // onDragEnd={handleDragEnd}
            />
          )}

          <Drawer open={isChatOpen} onOpenChange={setIsChatOpen}>
            <DrawerContent className="backdrop-blur-xl bg-gradient-to-b from-black/40 to-black/60 text-slate-100 border-t border-white/10">
              <DrawerHeader className="border-b border-white/10 pb-4">
                <DrawerTitle className="flex items-center gap-3">
                  <div className="relative">
                    <motion.div
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
                      animate={{ scale: isAiSpeaking ? 1.1 : 1 }}
                      transition={{ duration: 0.3, repeat: isAiSpeaking ? Infinity : 0, ease: "easeInOut" }}
                    >
                      <Zap className="h-6 w-6 text-white" />
                    </motion.div>
                    {isAiSpeaking && (
                      <motion.div
                        className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-900 rounded-full"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.7, 1]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">PMAI Assistant</h3>
                    <p className="text-xs text-slate-100">Project Management AI</p>
                  </div>
                  {!isAiSpeaking && (
                    <motion.div
                      className="flex items-center gap-1 ml-2 bg-white/10 px-2 py-1 rounded-full"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-xs text-white-500">Active</span>
                    </motion.div>
                  )}
                </DrawerTitle>
              </DrawerHeader>
              <div className="px-4 py-4 flex flex-col h-[calc(100vh-100px)]">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  <AnimatePresence>
                    {chatMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex items-end gap-2 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.sender === "ai" && (
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                              <Zap className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-[10px] text-slate-200">PMAI</span>
                          </div>
                        )}
                        <motion.div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${message.sender === "user"
                              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none"
                              : "bg-gradient-to-r from-white/20 to-white/10 text-slate-100 rounded-bl-none"
                            }`}
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="mt-1 text-right text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </motion.div>
                        {message.sender === "user" && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <span className="text-sm font-semibold text-white">U</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <div ref={messageEndRef} />
                </div>

                {showAiTaskForm && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mb-4 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-xl p-4"
                  >
                    <h3 className="text-lg font-medium mb-4 text-white flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Task
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="ai-task-title" className="text-white block mb-1.5">Title</Label>
                        <Input
                          id="ai-task-title"
                          value={aiTaskData.title}
                          onChange={(e) => setAiTaskData(prev => ({ ...prev, title: e.target.value }))}
                          className="bg-white/20 border-white/20 text-white placeholder:text-white/60"
                          placeholder="Enter task title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ai-task-description" className="text-white block mb-1.5">Description</Label>
                        <Input
                          id="ai-task-description"
                          value={aiTaskData.description}
                          onChange={(e) => setAiTaskData(prev => ({ ...prev, description: e.target.value }))}
                          className="bg-white/20 border-white/20 text-white placeholder:text-white/60"
                          placeholder="Enter task description"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ai-task-deadline" className="text-white block mb-1.5">Deadline</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !aiTaskData.deadline && "text-white/60",
                                "bg-white/20 border-white/20 text-white"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {aiTaskData.deadline ? format(new Date(aiTaskData.deadline), "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-black/80 border-white/20">
                            <CalendarComponent
                              mode="single"
                              selected={aiTaskData.deadline ? new Date(aiTaskData.deadline) : undefined}
                              onSelect={(date) => {
                                if (date) {
                                  setAiTaskData(prev => ({ ...prev, deadline: format(date, "yyyy-MM-dd") }));
                                }
                              }}
                              initialFocus
                              className="bg-black/80 text-white"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label htmlFor="ai-task-priority" className="text-white block mb-1.5">Priority</Label>
                        <select
                          id="ai-task-priority"
                          value={aiTaskData.priority}
                          onChange={(e) => setAiTaskData(prev => ({ ...prev, priority: e.target.value as "low" | "medium" | "high" }))}
                          className="w-full h-10 rounded-md border border-white/20 bg-white/20 px-3 py-2 text-sm text-white"
                        >
                          <option value="low" className="bg-black text-white">Low</option>
                          <option value="medium" className="bg-black text-white">Medium</option>
                          <option value="high" className="bg-black text-white">High</option>
                        </select>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => setShowAiTaskForm(false)}
                          className="flex-1 bg-white/20 hover:bg-white/30 text-white"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            addNewTask(aiTaskData.title, aiTaskData.description, aiTaskData.deadline, aiTaskData.priority);
                            setShowAiTaskForm(false);
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Create Task
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex items-center space-x-2 pt-4 border-t border-white/10">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Ask AI to add, update or delete tasks..."
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-full px-6"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    size="icon"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-full"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
};

export default ProjectBoard;
